"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/ui/data-table";
import { getFriendlyMessage } from "@/lib/api-error";

import { useDeletePenerbit } from "./penerbit.mutations";
import { usePenerbitList } from "./penerbit.queries";
import type { Penerbit } from "./penerbit.types";

export function PenerbitList() {
  const list = usePenerbitList();
  const deleteMutation = useDeletePenerbit();
  const [pendingDelete, setPendingDelete] = useState<Penerbit | null>(null);

  const items = list.data?.data ?? [];

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMutation.mutateAsync(pendingDelete.id);
      toast.success("Penerbit berhasil dihapus.");
      setPendingDelete(null);
    } catch (err) {
      toast.error(getFriendlyMessage(err, "Tidak dapat menghapus penerbit."));
    }
  };

  return (
    <>
      <DataTable
        items={items}
        getId={(item) => item.id}
        getSearchTarget={(item) =>
          `${item.penerbit_buku} ${item.alamat_penerbit} ${item.email_penerbit}`
        }
        searchPlaceholder="Cari nama, alamat, atau email..."
        emptyText="Belum ada penerbit. Tambahkan yang pertama."
        isLoading={list.isLoading}
        isError={list.isError}
        isFetching={list.isFetching}
        onRetry={() => list.refetch()}
        columns={[
          {
            id: "nama",
            header: "Nama Penerbit",
            cell: (item) => (
              <span className="font-medium text-slate-900">
                {item.penerbit_buku}
              </span>
            ),
          },
          {
            id: "alamat",
            header: "Alamat",
            hiddenBelow: "md",
            cell: (item) => (
              <span className="text-slate-600">
                {item.alamat_penerbit || "—"}
              </span>
            ),
          },
          {
            id: "email",
            header: "Email",
            hiddenBelow: "lg",
            cell: (item) => (
              <span className="text-slate-500">
                {item.email_penerbit || "—"}
              </span>
            ),
          },
        ]}
        rowAction={(item) => (
          <>
            <Link
              href={`/penerbit/${item.id}/edit`}
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
        title="Hapus penerbit?"
        description={
          pendingDelete
            ? `"${pendingDelete.penerbit_buku}" akan dihapus permanen dan tidak bisa dikembalikan.`
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
