import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/ui/page-header";
import { PenulisList } from "@/features/penulis/penulis-list";

export const metadata: Metadata = {
  title: "Penulis · Perpuskita",
  description: "Kelola data penulis buku.",
};

export default function PenulisPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Penulis"
        description="Kelola daftar penulis yang karyanya tersimpan di koleksi."
        action={
          <Link
            href="/penulis/baru"
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Tambah Penulis
          </Link>
        }
      />

      <PenulisList />
    </div>
  );
}
