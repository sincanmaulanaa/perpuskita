import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/ui/page-header";
import { PeminjamanList } from "@/features/peminjaman/peminjaman-list";

export const metadata: Metadata = {
  title: "Peminjaman",
  description: "Catatan peminjaman buku oleh anggota.",
};

export default function PeminjamanPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Peminjaman"
        description="Pantau dan kelola peminjaman buku oleh anggota."
        action={
          <Link
            href="/peminjaman/baru"
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Tambah Peminjaman
          </Link>
        }
      />
      <PeminjamanList />
    </div>
  );
}
