"use client";

import Link from "next/link";

import { DataTable } from "@/components/ui/data-table";

import { useAnggotaList } from "./anggota.queries";

export function AnggotaList() {
  const list = useAnggotaList();
  const items = list.data?.data ?? [];

  return (
    <DataTable
      items={items}
      getId={(item) => item.id_anggota}
      getSearchTarget={(item) =>
        `${item.nama} ${item.username} ${item.email} ${item.alamat}`
      }
      searchPlaceholder="Cari nama, email, atau alamat..."
      emptyText="Belum ada anggota terdaftar."
      isLoading={list.isLoading}
      isError={list.isError}
      isFetching={list.isFetching}
      onRetry={() => list.refetch()}
      columns={[
        {
          id: "nama",
          header: "Nama",
          cell: (item) => (
            <Link
              href={`/anggota/${item.id_anggota}`}
              className="font-medium text-slate-900 transition hover:text-slate-600 hover:underline"
            >
              {item.nama}
            </Link>
          ),
        },
        {
          id: "username",
          header: "Username",
          hiddenBelow: "sm",
          cell: (item) => (
            <span className="font-mono text-xs text-slate-500">
              {item.username}
            </span>
          ),
        },
        {
          id: "email",
          header: "Email",
          hiddenBelow: "md",
          cell: (item) => (
            <span className="text-slate-600">{item.email}</span>
          ),
        },
        {
          id: "telp",
          header: "Telepon",
          hiddenBelow: "lg",
          cell: (item) => (
            <span className="font-mono text-xs text-slate-500">
              {item.telp || "—"}
            </span>
          ),
        },
      ]}
    />
  );
}
