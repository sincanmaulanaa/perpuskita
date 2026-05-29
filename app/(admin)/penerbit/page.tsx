import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/ui/page-header";
import { PenerbitList } from "@/features/penerbit/penerbit-list";

export const metadata: Metadata = {
  title: "Penerbit",
  description: "Kelola data penerbit buku.",
};

export default function PenerbitPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Penerbit"
        description="Kelola daftar penerbit buku yang ada dalam koleksi."
        action={
          <Link
            href="/penerbit/baru"
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Tambah Penerbit
          </Link>
        }
      />

      <PenerbitList />
    </div>
  );
}
