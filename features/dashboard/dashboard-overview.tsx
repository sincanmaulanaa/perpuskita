"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { StatCard } from "@/components/ui/stat-card";
import { useAnggotaList } from "@/features/anggota/anggota.queries";
import { useBukuList } from "@/features/buku/buku.queries";
import { useDendaList } from "@/features/denda/denda.queries";
import { usePeminjamanList } from "@/features/peminjaman/peminjaman.queries";

export function DashboardOverview() {
  const bukuQuery = useBukuList();
  const anggotaQuery = useAnggotaList();
  const peminjamanQuery = usePeminjamanList();
  const dendaQuery = useDendaList();

  // Reference time captured on mount. Stats reflect the moment the
  // dashboard opened; reloading the page refreshes it.
  const [now] = useState(() => Date.now());

  const { stats, overdueItems, dendaCount } = useMemo(() => {
    const peminjamanItems = peminjamanQuery.data?.data ?? [];
    const dendaItems = dendaQuery.data?.data ?? [];

    const aktif = peminjamanItems.filter(
      (p) => new Date(p.tgl_hrs_kembali).getTime() >= now,
    ).length;
    const lewat = peminjamanItems.filter(
      (p) => new Date(p.tgl_hrs_kembali).getTime() < now,
    ).length;
    const totalDenda = dendaItems.reduce(
      (sum, d) => sum + (d.jumlah_denda ?? 0),
      0,
    );

    const overdue = peminjamanItems
      .filter((p) => new Date(p.tgl_hrs_kembali).getTime() < now)
      .sort(
        (a, b) =>
          new Date(a.tgl_hrs_kembali).getTime() -
          new Date(b.tgl_hrs_kembali).getTime(),
      )
      .slice(0, 5);

    return {
      stats: { aktif, lewat, totalDenda },
      overdueItems: overdue,
      dendaCount: dendaItems.length,
    };
  }, [peminjamanQuery.data?.data, dendaQuery.data?.data, now]);

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Buku"
          value={(bukuQuery.data?.data?.length ?? 0).toLocaleString("id-ID")}
          hint="Buku terdaftar dalam koleksi."
          icon={<BookIcon />}
          href="/buku"
          tone="brand"
          isLoading={bukuQuery.isLoading}
          isError={bukuQuery.isError}
        />
        <StatCard
          label="Total Anggota"
          value={(anggotaQuery.data?.data?.length ?? 0).toLocaleString("id-ID")}
          hint="Anggota perpustakaan aktif."
          icon={<UserIcon />}
          href="/anggota"
          tone="brand"
          isLoading={anggotaQuery.isLoading}
          isError={anggotaQuery.isError}
        />
        <StatCard
          label="Peminjaman Aktif"
          value={stats.aktif.toLocaleString("id-ID")}
          hint="Masih dalam masa pinjam."
          tone="success"
          icon={<CheckIcon />}
          href="/peminjaman"
          isLoading={peminjamanQuery.isLoading}
          isError={peminjamanQuery.isError}
        />
        <StatCard
          label="Lewat Batas"
          value={stats.lewat.toLocaleString("id-ID")}
          hint="Peminjaman yang melewati tanggal kembali."
          tone={stats.lewat > 0 ? "warning" : "default"}
          icon={<AlertIcon />}
          href="/peminjaman"
          isLoading={peminjamanQuery.isLoading}
          isError={peminjamanQuery.isError}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <OverdueCard
          items={overdueItems}
          isLoading={peminjamanQuery.isLoading}
          now={now}
        />
        <DendaCard
          total={stats.totalDenda}
          count={dendaCount}
          isLoading={dendaQuery.isLoading}
          isError={dendaQuery.isError}
        />
      </section>
    </div>
  );
}

type OverdueItem = {
  id: string;
  id_anggota: string;
  nama_anggota?: string;
  tgl_hrs_kembali: string;
};

function OverdueCard({
  items,
  isLoading,
  now,
}: {
  items: OverdueItem[];
  isLoading: boolean;
  now: number;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Peminjaman Lewat Batas
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Peminjaman paling lama tertahan, urut dari paling lampau.
          </p>
        </div>
        <Link
          href="/peminjaman"
          className="text-xs font-medium text-slate-600 transition hover:text-slate-900"
        >
          Lihat semua →
        </Link>
      </header>

      <div className="mt-4">
        {isLoading ? (
          <ul className="space-y-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 rounded-lg p-2"
                aria-hidden
              >
                <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
                </div>
              </li>
            ))}
          </ul>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <span
              aria-hidden
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"
            >
              <CheckIcon />
            </span>
            <p className="text-sm font-medium text-slate-900">
              Semua peminjaman tepat waktu
            </p>
            <p className="text-xs text-slate-500">
              Tidak ada anggota yang melewati tanggal kembali.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((item) => (
              <li key={item.id} className="py-3">
                <Link
                  href={`/peminjaman/${item.id}`}
                  className="group flex items-center justify-between gap-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600"
                    >
                      <ClockIcon />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900 transition group-hover:text-slate-600">
                        {item.nama_anggota || "Anggota tidak diketahui"}
                      </p>
                      <p className="text-xs text-slate-500">
                        Harus kembali {formatDate(item.tgl_hrs_kembali)}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-red-600 tabular-nums">
                    {daysSince(item.tgl_hrs_kembali, now)} hari
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

function DendaCard({
  total,
  count,
  isLoading,
  isError,
}: {
  total: number;
  count: number;
  isLoading: boolean;
  isError: boolean;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header>
        <h2 className="text-sm font-semibold text-slate-900">Total Denda</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Akumulasi catatan denda yang tersimpan.
        </p>
      </header>

      <div className="mt-5">
        {isLoading ? (
          <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
        ) : isError ? (
          <p className="text-sm text-slate-500">Gagal memuat data.</p>
        ) : (
          <>
            <p className="text-2xl font-semibold tracking-tight text-slate-900">
              Rp {total.toLocaleString("id-ID")}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              dari{" "}
              <span className="font-medium text-slate-700">
                {count.toLocaleString("id-ID")}
              </span>{" "}
              catatan denda
            </p>
          </>
        )}
      </div>

      <Link
        href="/denda"
        className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-slate-600 transition hover:text-slate-900"
      >
        Lihat catatan denda →
      </Link>
    </article>
  );
}

function daysSince(dateString: string, now: number): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  const ms = now - date.getTime();
  const days = Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
  return days.toLocaleString("id-ID");
}

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className="h-4 w-4"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6.5v12a1 1 0 0 0 1 1h6V5H6.5A2.5 2.5 0 0 0 4 6.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 6.5v12a1 1 0 0 1-1 1h-6V5h4.5A2.5 2.5 0 0 1 20 6.5Z"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className="h-4 w-4"
      aria-hidden
    >
      <circle cx={12} cy={8} r={4} />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-4 w-4"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4 10-10" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className="h-4 w-4"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4 2 21h20L12 4Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v4m0 3v.01" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className="h-4 w-4"
      aria-hidden
    >
      <circle cx={12} cy={12} r={9} />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
    </svg>
  );
}
