"use client";

import { useBukuList } from "./buku.queries";

export function BukuStatsCard() {
  const { data, isLoading, isError } = useBukuList();

  const total = data?.data?.length ?? 0;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">Total Buku</span>
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            className="h-4 w-4"
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
        </span>
      </div>

      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
        {isLoading ? (
          <span className="text-slate-400">···</span>
        ) : isError ? (
          <span className="text-slate-400">—</span>
        ) : (
          total.toLocaleString("id-ID")
        )}
      </div>

      <p className="mt-1 text-xs text-slate-500">
        {isError
          ? "Gagal memuat data buku."
          : "Buku terdaftar dalam koleksi."}
      </p>
    </article>
  );
}
