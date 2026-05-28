import type { Metadata } from "next";

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

      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Menu pengelolaan koleksi, peminjaman, dan denda akan muncul di sini.
      </section>
    </div>
  );
}
