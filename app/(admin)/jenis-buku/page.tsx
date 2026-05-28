import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/ui/page-header";
import { JenisBukuList } from "@/features/jenis-buku/jenis-buku-list";

export const metadata: Metadata = {
  title: "Jenis Buku · Perpuskita",
  description: "Kelola kategori buku.",
};

export default function JenisBukuPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Jenis Buku"
        description="Kelola kategori untuk mengelompokkan buku."
        action={
          <Link
            href="/jenis-buku/baru"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Tambah Jenis
          </Link>
        }
      />

      <JenisBukuList />
    </div>
  );
}
