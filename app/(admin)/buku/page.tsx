import type { Metadata } from "next";

import { BukuTable } from "@/features/buku/buku-table";

export const metadata: Metadata = {
  title: "Buku · Perpuskita",
  description: "Kelola koleksi buku perpustakaan.",
};

export default function BukuPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Daftar Buku
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Cari dan telusuri seluruh koleksi buku perpustakaan.
        </p>
      </header>

      <BukuTable />
    </div>
  );
}
