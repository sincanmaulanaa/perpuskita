"use client";

import Link from "next/link";

import { isApiError } from "@/lib/api-error";

import { useAnggotaById } from "./anggota.queries";

type AnggotaDetailProps = {
  id: string;
};

export function AnggotaDetail({ id }: AnggotaDetailProps) {
  const query = useAnggotaById(id);

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        <BackLink />
        <div className="h-64 animate-pulse rounded-2xl bg-white" />
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
            {notFound ? "Anggota tidak ditemukan." : "Gagal memuat data."}
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

  const a = query.data.data;
  const initials = getInitials(a.nama);

  return (
    <article className="space-y-6">
      <BackLink />

      <header className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div
          aria-hidden
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-xl font-semibold text-white"
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900">
            {a.nama}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            <span className="font-mono">{a.username}</span> ·{" "}
            {a.jenis_kelamin}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Kontak" className="lg:col-span-2">
          <Row label="Email">{a.email || "—"}</Row>
          <Row label="Telepon">{a.telp || "—"}</Row>
          <Row label="Alamat">{a.alamat || "—"}</Row>
        </Card>

        <Card title="Identitas">
          <Row label="ID Anggota" mono>
            {a.id_anggota}
          </Row>
          <Row label="Username">{a.username}</Row>
        </Card>
      </div>

      <Card title="Catatan">
        <p className="text-sm leading-relaxed text-slate-700">
          {a.deskripsi?.trim() || "Belum ada catatan untuk anggota ini."}
        </p>
      </Card>

      <p className="text-xs text-slate-400">
        Terdaftar {formatDate(a.created_at)} · Diperbarui{" "}
        {formatDate(a.updated_at)}
      </p>
    </article>
  );
}

function BackLink() {
  return (
    <Link
      href="/anggota"
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
      Kembali ke daftar anggota
    </Link>
  );
}

type CardProps = {
  title: string;
  className?: string;
  children: React.ReactNode;
};

function Card({ title, className, children }: CardProps) {
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
  mono,
  children,
}: {
  label: string;
  mono?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
      <dt className="w-32 shrink-0 text-slate-500">{label}</dt>
      <dd
        className={
          "text-slate-900 break-words" +
          (mono ? " font-mono text-xs uppercase" : "")
        }
      >
        {children}
      </dd>
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join("") || "?";
}

function formatDate(value: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}
