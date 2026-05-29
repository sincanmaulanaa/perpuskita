"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/ui/data-table";
import { getFriendlyMessage } from "@/lib/api-error";

import { useDeletePeminjaman } from "./peminjaman.mutations";
import { usePeminjamanList } from "./peminjaman.queries";
import type { PeminjamanListItem } from "./peminjaman.types";

export function PeminjamanList() {
  const list = usePeminjamanList();
  const deleteMutation = useDeletePeminjaman();
  const [pendingDelete, setPendingDelete] =
    useState<PeminjamanListItem | null>(null);

  const items = list.data?.data ?? [];

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMutation.mutateAsync(pendingDelete.id);
      toast.success("Peminjaman berhasil dihapus.");
      setPendingDelete(null);
    } catch (err) {
      toast.error(
        getFriendlyMessage(err, "Tidak dapat menghapus peminjaman."),
      );
    }
  };

  return (
    <>
      <DataTable
        items={items}
        getId={(item) => item.id}
        getSearchTarget={(item) =>
          `${item.nama_anggota ?? ""} ${item.jaminan} ${item.id_anggota}`
        }
        searchPlaceholder="Cari nama anggota atau jaminan..."
        emptyText="Belum ada catatan peminjaman."
        isLoading={list.isLoading}
        isError={list.isError}
        isFetching={list.isFetching}
        onRetry={() => list.refetch()}
        columns={[
          {
            id: "anggota",
            header: "Anggota",
            cell: (item) => (
              <Link
                href={`/peminjaman/${item.id}`}
                className="font-medium text-slate-900 transition hover:text-slate-600 hover:underline"
              >
                {item.nama_anggota || "—"}
              </Link>
            ),
          },
          {
            id: "tgl_pinjam",
            header: "Pinjam",
            hiddenBelow: "sm",
            cell: (item) => (
              <span className="text-slate-600">
                {formatDate(item.tgl_pinjam)}
              </span>
            ),
          },
          {
            id: "tgl_kembali",
            header: "Harus Kembali",
            hiddenBelow: "md",
            cell: (item) => (
              <DueDate value={item.tgl_hrs_kembali} />
            ),
          },
          {
            id: "jaminan",
            header: "Jaminan",
            hiddenBelow: "lg",
            cell: (item) => (
              <span className="text-slate-600">{item.jaminan}</span>
            ),
          },
          {
            id: "buku",
            header: "Buku",
            align: "right",
            cell: (item) => (
              <span className="tabular-nums text-slate-700">
                {item.jumlah_buku}
              </span>
            ),
          },
        ]}
        rowAction={(item) => (
          <>
            <Link
              href={`/peminjaman/${item.id}/edit`}
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Edit
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setPendingDelete(item)}
            >
              Hapus
            </Button>
          </>
        )}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Hapus peminjaman?"
        description={
          pendingDelete
            ? `Catatan peminjaman atas nama ${pendingDelete.nama_anggota ?? "anggota ini"} akan dihapus permanen.`
            : undefined
        }
        confirmLabel="Hapus"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!deleteMutation.isPending) setPendingDelete(null);
        }}
      />
    </>
  );
}

function DueDate({ value }: { value: string }) {
  const date = new Date(value);
  const now = new Date();
  const overdue = date.getTime() < now.getTime();

  return (
    <span
      className={
        overdue ? "text-red-600 font-medium" : "text-slate-600"
      }
    >
      {formatDate(value)}
      {overdue ? " · lewat" : ""}
    </span>
  );
}

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
