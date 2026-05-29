import type { Metadata } from "next";

import { DashboardOverview } from "@/features/dashboard/dashboard-overview";

export const metadata: Metadata = {
  title: "Beranda",
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

      <DashboardOverview />
    </div>
  );
}
