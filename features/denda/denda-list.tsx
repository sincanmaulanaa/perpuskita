"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/ui/data-table";
import { getFriendlyMessage } from "@/lib/api-error";

import { useDeleteDenda } from "./denda.mutations";
import { useDendaList } from "./denda.queries";
import type { Denda } from "./denda.types";

export function DendaList() {
  const list = useDendaList();
  const deleteMutation = useDeleteDenda();
  const [pendingDelete, setPendingDelete] = useState<Denda | null>(null);

  const items = list.data?.data ?? [];

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMutation.mutateAsync(pendingDelete.id_denda);
      toast.success("Denda berhasil dihapus.");
      setPendingDelete(null);
    } catch (err) {
      toast.error(getFriendlyMessage(err, "Tidak dapat menghapus denda."));
    }
  };

  return (
    <>
      <DataTable
        items={items}
        getId={(item) => item.id_denda}
        getSearchTarget={(item) =>
          `${item.nama_anggota ?? ""} ${item.id_anggota} ${item.jumlah_denda}`
        }
        searchPlaceholder="Cari nama anggota atau jumlah..."
        emptyText="Belum ada catatan denda."
        isLoading={list.isLoading}
        isError={list.isError}
        isFetching={list.isFetching}
        onRetry={() => list.refetch()}
        columns={[
          {
            id: "anggota",
            header: "Anggota",
            cell: (item) => (
              <span className="font-medium text-slate-900">
                {item.nama_anggota || "—"}
              </span>
            ),
          },
          {
            id: "jumlah",
            header: "Jumlah Denda",
            align: "right",
            cell: (item) => (
              <span className="tabular-nums font-medium text-slate-900">
                {formatRupiah(item.jumlah_denda)}
              </span>
            ),
          },
          {
            id: "kembali",
            header: "Tanggal Kembali",
            hiddenBelow: "md",
            cell: (item) => (
              <span className="text-slate-600">
                {formatDate(item.tgl_kembali)}
              </span>
            ),
          },
          {
            id: "telat",
            header: "Telat",
            hiddenBelow: "lg",
            align: "right",
            cell: (item) => (
              <LateBadge
                tglHrsKembali={item.tgl_hrs_kembali}
                tglKembali={item.tgl_kembali}
              />
            ),
          },
        ]}
        rowAction={(item) => (
          <>
            <Link
              href={`/denda/${item.id_denda}/edit`}
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
        title="Hapus catatan denda?"
        description={
          pendingDelete
            ? `Catatan denda atas nama ${pendingDelete.nama_anggota ?? "anggota ini"} akan dihapus permanen.`
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

function LateBadge({
  tglHrsKembali,
  tglKembali,
}: {
  tglHrsKembali: string;
  tglKembali: string;
}) {
  const due = new Date(tglHrsKembali).getTime();
  const back = new Date(tglKembali).getTime();
  if (Number.isNaN(due) || Number.isNaN(back) || back <= due) {
    return <span className="text-slate-500">—</span>;
  }
  const days = Math.ceil((back - due) / (24 * 60 * 60 * 1000));
  return (
    <span className="text-red-600 tabular-nums">
      {days.toLocaleString("id-ID")} hari
    </span>
  );
}

function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
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
