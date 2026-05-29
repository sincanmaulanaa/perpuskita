import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/page-header";
import { AnggotaList } from "@/features/anggota/anggota-list";

export const metadata: Metadata = {
  title: "Anggota · Perpuskita",
  description: "Daftar anggota perpustakaan.",
};

export default function AnggotaPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Anggota"
        description="Daftar anggota perpustakaan terdaftar."
      />
      <AnggotaList />
    </div>
  );
}
