"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useBukuList } from "./buku.queries";
import type { Buku } from "./buku.types";

const PAGE_SIZE = 10;

export function BukuTable() {
  const { data, isLoading, isError, refetch, isFetching } = useBukuList();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounce the search input so filtering doesn't run on every keystroke,
  // and reset to page 1 whenever the term effectively changes.
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
      setPage(1);
    }, 250);
    return () => clearTimeout(handle);
  }, [search]);

  const filtered = useMemo(() => {
    const items = data?.data ?? [];
    if (!debouncedSearch) return items;
    return items.filter(
      (item) =>
        item.judul_buku.toLowerCase().includes(debouncedSearch) ||
        item.isbn.toLowerCase().includes(debouncedSearch),
    );
  }, [data?.data, debouncedSearch]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, totalItems);
  const visibleItems = filtered.slice(start, end);

  return (
    <div className="space-y-4">
      <SearchBar value={search} onChange={setSearch} />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <SkeletonRows />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : totalItems === 0 ? (
          <EmptyState
            isSearching={Boolean(debouncedSearch)}
            search={debouncedSearch}
          />
        ) : (
          <>
            <BukuRows items={visibleItems} startIndex={start} />
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              start={start + 1}
              end={end}
              total={totalItems}
              isRefreshing={isFetching && !isLoading}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </>
        )}
      </div>
    </div>
  );
}

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      >
        <SearchIcon />
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Cari berdasarkan judul atau ISBN..."
        aria-label="Cari buku"
        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      />
    </div>
  );
}

type BukuRowsProps = {
  items: Buku[];
  startIndex: number;
};

function BukuRows({ items, startIndex }: BukuRowsProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
          <tr>
            <th scope="col" className="px-4 py-3 w-12 text-right">
              No
            </th>
            <th scope="col" className="px-4 py-3">
              Judul
            </th>
            <th scope="col" className="px-4 py-3 hidden md:table-cell">
              ISBN
            </th>
            <th scope="col" className="px-4 py-3 hidden sm:table-cell">
              Tahun
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              Stok
            </th>
            <th scope="col" className="px-4 py-3 hidden lg:table-cell">
              Rak
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item, index) => (
            <tr key={item.id_buku} className="transition hover:bg-slate-50">
              <td className="px-4 py-3 text-right text-slate-400">
                {startIndex + index + 1}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/buku/${item.id_buku}`}
                  className="font-medium text-slate-900 transition hover:text-slate-600 hover:underline"
                  title={item.judul_buku}
                >
                  {item.judul_buku}
                </Link>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-500 hidden md:table-cell">
                {item.isbn}
              </td>
              <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">
                {item.tahun_terbit}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                {item.stok_buku}
              </td>
              <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">
                {item.rak_buku}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  start: number;
  end: number;
  total: number;
  isRefreshing: boolean;
  onPrev: () => void;
  onNext: () => void;
};

function Pagination({
  currentPage,
  totalPages,
  start,
  end,
  total,
  isRefreshing,
  onPrev,
  onNext,
}: PaginationProps) {
  const formattedStart = start.toLocaleString("id-ID");
  const formattedEnd = end.toLocaleString("id-ID");
  const formattedTotal = total.toLocaleString("id-ID");

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-slate-600">
        Menampilkan{" "}
        <span className="font-medium text-slate-900">
          {formattedStart}–{formattedEnd}
        </span>{" "}
        dari{" "}
        <span className="font-medium text-slate-900">{formattedTotal}</span>{" "}
        buku{isRefreshing ? " · memperbarui..." : ""}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          <ChevronLeftIcon />
          Sebelumnya
        </button>
        <span className="px-2 text-slate-500">
          Halaman <span className="text-slate-900">{currentPage}</span> dari{" "}
          {totalPages}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          Berikutnya
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="divide-y divide-slate-100">
      <div className="bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Memuat daftar buku...
      </div>
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-center gap-4 px-4 py-3"
          aria-hidden
        >
          <div className="h-4 w-8 animate-pulse rounded bg-slate-200" />
          <div className="h-4 flex-1 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-12 animate-pulse rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

type ErrorStateProps = {
  onRetry: () => void;
};

function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
      <p className="text-sm text-slate-600">
        Gagal memuat daftar buku. Silakan coba lagi.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Coba lagi
      </button>
    </div>
  );
}

type EmptyStateProps = {
  isSearching: boolean;
  search: string;
};

function EmptyState({ isSearching, search }: EmptyStateProps) {
  return (
    <div className="px-4 py-16 text-center text-sm text-slate-500">
      {isSearching
        ? `Tidak ditemukan buku yang cocok dengan "${search}".`
        : "Belum ada buku terdaftar."}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      className="h-4 w-4"
      aria-hidden
    >
      <circle cx={11} cy={11} r={7} />
      <path strokeLinecap="round" d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
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
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-4 w-4"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m10 7 5 5-5 5" />
    </svg>
  );
}
