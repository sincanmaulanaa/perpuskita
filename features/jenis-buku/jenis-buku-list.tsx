"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/ui/data-table";
import { getFriendlyMessage } from "@/lib/api-error";

import { useDeleteJenisBuku } from "./jenis-buku.mutations";
import { useJenisBukuList } from "./jenis-buku.queries";
import type { JenisBuku } from "./jenis-buku.types";

export function JenisBukuList() {
  const list = useJenisBukuList();
  const deleteMutation = useDeleteJenisBuku();
  const [pendingDelete, setPendingDelete] = useState<JenisBuku | null>(null);

  const items = list.data?.data ?? [];

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMutation.mutateAsync(pendingDelete.id);
      toast.success("Jenis buku berhasil dihapus.");
      setPendingDelete(null);
    } catch (err) {
      toast.error(
        getFriendlyMessage(err, "Tidak dapat menghapus jenis buku."),
      );
    }
  };

  return (
    <>
      <DataTable
        items={items}
        getId={(item) => item.id}
        getSearchTarget={(item) => `${item.jenis_buku} ${item.deskripsi}`}
        searchPlaceholder="Cari nama jenis atau deskripsi..."
        emptyText="Belum ada jenis buku. Tambahkan yang pertama."
        isLoading={list.isLoading}
        isError={list.isError}
        isFetching={list.isFetching}
        onRetry={() => list.refetch()}
        columns={[
          {
            id: "jenis",
            header: "Nama Jenis",
            cell: (item) => (
              <span className="font-medium text-slate-900">
                {item.jenis_buku}
              </span>
            ),
          },
          {
            id: "deskripsi",
            header: "Deskripsi",
            hiddenBelow: "md",
            cell: (item) => (
              <span className="text-slate-600">{item.deskripsi || "—"}</span>
            ),
          },
          {
            id: "updated",
            header: "Diperbarui",
            hiddenBelow: "lg",
            cell: (item) => (
              <span className="text-slate-500">
                {formatDate(item.updated_at)}
              </span>
            ),
          },
        ]}
        rowAction={(item) => (
          <>
            <Link
              href={`/jenis-buku/${item.id}/edit`}
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
        title="Hapus jenis buku?"
        description={
          pendingDelete
            ? `"${pendingDelete.jenis_buku}" akan dihapus permanen dan tidak bisa dikembalikan.`
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
