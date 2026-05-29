"use client";

import Link from "next/link";

import { isApiError } from "@/lib/api-error";

import { usePeminjamanFullDetail } from "./peminjaman.queries";

type PeminjamanDetailViewProps = {
  id: string;
};

export function PeminjamanDetailView({ id }: PeminjamanDetailViewProps) {
  const query = usePeminjamanFullDetail(id);

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        <BackLink />
        <div className="h-32 animate-pulse rounded-2xl bg-white" />
        <div className="h-48 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  if (query.isError || !query.data?.data) {
    const notFound =
      isApiError(query.error) &&
      query.error.message.toLowerCase().includes("not found");
    return (
      <div className="space-y-4">
        <BackLink />
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-base font-medium text-slate-900">
            {notFound ? "Peminjaman tidak ditemukan." : "Gagal memuat data."}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {notFound
              ? "Periksa kembali tautan yang Anda buka."
              : "Silakan coba beberapa saat lagi."}
          </p>
        </div>
      </div>
    );
  }

  const peminjaman = query.data.data;
  const overdue = isOverdue(peminjaman.tgl_hrs_kembali);

  return (
    <article className="space-y-6">
      <BackLink />

      <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Peminjaman
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
            {peminjaman.anggota.nama || "—"}
          </h1>
          <p className="mt-1 font-mono text-xs text-slate-500">
            {peminjaman.anggota.id_anggota}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {overdue ? (
            <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200">
              Lewat batas
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
              Aktif
            </span>
          )}
          <Link
            href={`/peminjaman/${peminjaman.id}/edit`}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Edit
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Periode">
          <Row label="Tanggal Pinjam">{formatDate(peminjaman.tgl_pinjam)}</Row>
          <Row label="Harus Kembali">
            <span className={overdue ? "font-medium text-red-600" : ""}>
              {formatDate(peminjaman.tgl_hrs_kembali)}
            </span>
          </Row>
          <Row label="Jaminan">{peminjaman.jaminan}</Row>
        </Card>

        <Card title={`Buku Dipinjam (${peminjaman.details.length})`} className="lg:col-span-2">
          {peminjaman.details.length === 0 ? (
            <p className="text-sm text-slate-500">
              Belum ada buku tercatat untuk peminjaman ini.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {peminjaman.details.map((d) => (
                <li
                  key={d.id_detailpinjam}
                  className="flex items-start gap-3 py-3"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"
                  >
                    <BookIcon />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/buku/${d.id_buku}`}
                      className="block truncate text-sm font-medium text-slate-900 transition hover:text-slate-600 hover:underline"
                      title={d.judul_buku}
                    >
                      {d.judul_buku || "Judul tidak diketahui"}
                    </Link>
                    <p className="text-xs text-slate-500">
                      <span className="font-mono">{d.isbn || "—"}</span>{" "}
                      · Kondisi {d.kondisi}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <p className="text-xs text-slate-400">
        Dibuat {formatDate(peminjaman.created_at)} · Diperbarui{" "}
        {formatDate(peminjaman.updated_at)}
      </p>
    </article>
  );
}

function isOverdue(value: string) {
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.getTime() < Date.now();
}

function BackLink() {
  return (
    <Link
      href="/peminjaman"
      className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-4 w-4"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m14 7-5 5 5 5" />
      </svg>
      Kembali ke daftar peminjaman
    </Link>
  );
}

function Card({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" +
        (className ? ` ${className}` : "")
      }
    >
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <dl className="mt-4 space-y-3 text-sm">{children}</dl>
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
      <dt className="w-32 shrink-0 text-slate-500">{label}</dt>
      <dd className="text-slate-900">{children}</dd>
    </div>
  );
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

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
