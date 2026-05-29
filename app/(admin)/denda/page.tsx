import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/ui/page-header";
import { DendaList } from "@/features/denda/denda-list";

export const metadata: Metadata = {
  title: "Denda · Perpuskita",
  description: "Catatan denda keterlambatan pengembalian buku.",
};

export default function DendaPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Denda"
        description="Pantau dan kelola denda keterlambatan pengembalian."
        action={
          <Link
            href="/denda/baru"
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Tambah Denda
          </Link>
        }
      />
      <DendaList />
    </div>
  );
}
