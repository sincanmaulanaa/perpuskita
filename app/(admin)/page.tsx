import type { Metadata } from "next";

import { BukuStatsCard } from "@/features/buku/buku-stats-card";

export const metadata: Metadata = {
  title: "Beranda · Perpuskita",
  description: "Ringkasan koleksi dan aktivitas perpustakaan.",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Beranda
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Ringkasan perpustakaan Anda hari ini.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <BukuStatsCard />
      </section>
    </div>
  );
}
