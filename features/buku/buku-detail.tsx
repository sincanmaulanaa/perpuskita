"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useJenisBukuList } from "@/features/jenis-buku/jenis-buku.queries";
import { usePenerbitList } from "@/features/penerbit/penerbit.queries";
import { usePenulisList } from "@/features/penulis/penulis.queries";
import { isApiError } from "@/lib/api-error";

import { useBukuById } from "./buku.queries";
import type { Buku } from "./buku.types";

type BukuDetailProps = {
  id: string;
};

export function BukuDetail({ id }: BukuDetailProps) {
  const bukuQuery = useBukuById(id);
  const jenisQuery = useJenisBukuList();
  const penulisQuery = usePenulisList();
  const penerbitQuery = usePenerbitList();

  const jenisMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of jenisQuery.data?.data ?? []) {
      map.set(item.id, item.jenis_buku);
    }
    return map;
  }, [jenisQuery.data]);

  const penulisMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of penulisQuery.data?.data ?? []) {
      map.set(item.id, item.penulis_buku);
    }
    return map;
  }, [penulisQuery.data]);

  const penerbitMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of penerbitQuery.data?.data ?? []) {
      map.set(item.id, item.penerbit_buku);
    }
    return map;
  }, [penerbitQuery.data]);

  if (bukuQuery.isLoading) {
    return <DetailSkeleton />;
  }

  if (bukuQuery.isError || !bukuQuery.data?.data) {
    const notFound =
      isApiError(bukuQuery.error) &&
      bukuQuery.error.message.toLowerCase().includes("not found");

    return (
      <ErrorPanel
        title={notFound ? "Buku tidak ditemukan." : "Gagal memuat buku."}
        message={
          notFound
            ? "Periksa kembali tautan yang Anda buka."
            : "Silakan coba beberapa saat lagi."
        }
      />
    );
  }

  const buku = bukuQuery.data.data;

  const jenisName = resolveName(jenisMap, buku.id_kategori_buku, jenisQuery);
  const penulisName = resolveName(penulisMap, buku.id_penulis_buku, penulisQuery);
  const penerbitName = resolveName(penerbitMap, buku.id_penerbit_buku, penerbitQuery);

  return (
    <article className="space-y-6">
      <BackLink />

      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="font-mono text-xs uppercase tracking-wider text-slate-500">
          {buku.isbn}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          {buku.judul_buku}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {jenisName ?? "—"} · Terbit {buku.tahun_terbit}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DetailCard title="Informasi Buku" className="lg:col-span-2">
          <DetailRow label="Penulis">{penulisName ?? "—"}</DetailRow>
          <DetailRow label="Penerbit">{penerbitName ?? "—"}</DetailRow>
          <DetailRow label="Jenis">{jenisName ?? "—"}</DetailRow>
          <DetailRow label="Tahun Terbit">{buku.tahun_terbit}</DetailRow>
          <DetailRow label="ISBN" mono>
            {buku.isbn}
          </DetailRow>
        </DetailCard>

        <DetailCard title="Inventaris">
          <DetailRow label="Stok">
            <span className="tabular-nums">{buku.stok_buku}</span> eksemplar
          </DetailRow>
          <DetailRow label="Rak">{buku.rak_buku || "—"}</DetailRow>
          <DetailRow label="Kondisi">{buku.kondisi_buku || "—"}</DetailRow>
        </DetailCard>
      </div>

      <DetailCard title="Deskripsi">
        <p className="text-sm leading-relaxed text-slate-700">
          {buku.deskripsi_buku?.trim() || "Belum ada deskripsi untuk buku ini."}
        </p>
      </DetailCard>

      <Timestamps buku={buku} />
    </article>
  );
}

function resolveName(
  map: Map<string, string>,
  id: string,
  query: { isLoading: boolean; isError: boolean },
): string | null {
  const name = map.get(id);
  if (name) return name;
  if (query.isLoading) return "Memuat...";
  if (query.isError) return null;
  return null;
}

function BackLink() {
  return (
    <Link
      href="/buku"
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
      Kembali ke daftar buku
    </Link>
  );
}

type DetailCardProps = {
  title: string;
  className?: string;
  children: React.ReactNode;
};

function DetailCard({ title, className, children }: DetailCardProps) {
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

type DetailRowProps = {
  label: string;
  mono?: boolean;
  children: React.ReactNode;
};

function DetailRow({ label, mono, children }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
      <dt className="w-32 shrink-0 text-slate-500">{label}</dt>
      <dd
        className={
          "text-slate-900" + (mono ? " font-mono text-xs uppercase" : "")
        }
      >
        {children}
      </dd>
    </div>
  );
}

function Timestamps({ buku }: { buku: Buku }) {
  return (
    <p className="text-xs text-slate-400">
      Ditambahkan {formatDate(buku.created_at)} · Diperbarui{" "}
      {formatDate(buku.updated_at)}
    </p>
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

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-7 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-3 w-48 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-48 animate-pulse rounded-2xl bg-white" />
        <div className="h-48 animate-pulse rounded-2xl bg-white" />
      </div>
    </div>
  );
}

type ErrorPanelProps = {
  title: string;
  message: string;
};

function ErrorPanel({ title, message }: ErrorPanelProps) {
  return (
    <div className="space-y-4">
      <BackLink />
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <p className="text-base font-medium text-slate-900">{title}</p>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
}
