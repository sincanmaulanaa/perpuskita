"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/ui/data-table";
import { getFriendlyMessage } from "@/lib/api-error";

import { useDeletePenulis } from "./penulis.mutations";
import { usePenulisList } from "./penulis.queries";
import type { Penulis } from "./penulis.types";

export function PenulisList() {
  const list = usePenulisList();
  const deleteMutation = useDeletePenulis();
  const [pendingDelete, setPendingDelete] = useState<Penulis | null>(null);

  const items = list.data?.data ?? [];

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMutation.mutateAsync(pendingDelete.id);
      toast.success("Penulis berhasil dihapus.");
      setPendingDelete(null);
    } catch (err) {
      toast.error(getFriendlyMessage(err, "Tidak dapat menghapus penulis."));
    }
  };

  return (
    <>
      <DataTable
        items={items}
        getId={(item) => item.id}
        getSearchTarget={(item) =>
          `${item.penulis_buku} ${item.alamat} ${item.email_penulis}`
        }
        searchPlaceholder="Cari nama, alamat, atau email..."
        emptyText="Tambahkan penulis pertama agar bisa dihubungkan ke buku."
        emptyAction={
          <Link
            href="/penulis/baru"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Tambah Penulis
          </Link>
        }
        isLoading={list.isLoading}
        isError={list.isError}
        isFetching={list.isFetching}
        onRetry={() => list.refetch()}
        columns={[
          {
            id: "nama",
            header: "Nama Penulis",
            cell: (item) => (
              <span className="font-medium text-slate-900">
                {item.penulis_buku}
              </span>
            ),
          },
          {
            id: "alamat",
            header: "Alamat",
            hiddenBelow: "md",
            cell: (item) => (
              <span className="text-slate-600">{item.alamat || "—"}</span>
            ),
          },
          {
            id: "email",
            header: "Email",
            hiddenBelow: "lg",
            cell: (item) => (
              <span className="text-slate-500">
                {item.email_penulis || "—"}
              </span>
            ),
          },
        ]}
        rowAction={(item) => (
          <>
            <Link
              href={`/penulis/${item.id}/edit`}
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
        title="Hapus penulis?"
        description={
          pendingDelete
            ? `"${pendingDelete.penulis_buku}" akan dihapus permanen dan tidak bisa dikembalikan.`
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
