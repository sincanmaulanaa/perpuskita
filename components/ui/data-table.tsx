"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

export type DataTableColumn<T> = {
  id: string;
  header: string;
  cell: (item: T, index: number) => ReactNode;
  className?: string;
  align?: "left" | "right";
  /** Hide this column below the given Tailwind breakpoint. */
  hiddenBelow?: "sm" | "md" | "lg";
};

type DataTableProps<T> = {
  items: T[];
  columns: DataTableColumn<T>[];
  getId: (item: T) => string;
  /** Returns the lowercase string used to filter the row. Empty string disables search match. */
  getSearchTarget: (item: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  isFetching?: boolean;
  onRetry?: () => void;
  searchPlaceholder?: string;
  emptyText?: string;
  rowAction?: (item: T) => ReactNode;
  pageSize?: number;
};

export function DataTable<T>({
  items,
  columns,
  getId,
  getSearchTarget,
  isLoading,
  isError,
  isFetching,
  onRetry,
  searchPlaceholder = "Cari...",
  emptyText = "Belum ada data.",
  rowAction,
  pageSize = 10,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
      setPage(1);
    }, 250);
    return () => clearTimeout(id);
  }, [search]);

  const filtered = useMemo(() => {
    if (!debouncedSearch) return items;
    return items.filter((item) =>
      getSearchTarget(item).toLowerCase().includes(debouncedSearch),
    );
  }, [items, debouncedSearch, getSearchTarget]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = Math.min(start + pageSize, totalItems);
  const visible = filtered.slice(start, end);

  const showSearch = !isLoading && !isError;

  return (
    <div className="space-y-4">
      {showSearch ? (
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={searchPlaceholder}
        />
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <SkeletonRows />
        ) : isError ? (
          <ErrorState onRetry={onRetry} />
        ) : totalItems === 0 ? (
          <EmptyState
            isSearching={Boolean(debouncedSearch)}
            search={debouncedSearch}
            emptyText={emptyText}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th scope="col" className="px-4 py-3 w-12 text-right">
                      No
                    </th>
                    {columns.map((column) => (
                      <th
                        key={column.id}
                        scope="col"
                        className={cn(
                          "px-4 py-3",
                          column.align === "right" && "text-right",
                          hiddenBelowToClass(column.hiddenBelow),
                          column.className,
                        )}
                      >
                        {column.header}
                      </th>
                    ))}
                    {rowAction ? (
                      <th
                        scope="col"
                        className="px-4 py-3 w-20 text-right"
                      >
                        <span className="sr-only">Aksi</span>
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visible.map((item, index) => (
                    <tr
                      key={getId(item)}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 text-right text-slate-400">
                        {start + index + 1}
                      </td>
                      {columns.map((column) => (
                        <td
                          key={column.id}
                          className={cn(
                            "px-4 py-3",
                            column.align === "right" && "text-right",
                            hiddenBelowToClass(column.hiddenBelow),
                            column.className,
                          )}
                        >
                          {column.cell(item, index)}
                        </td>
                      ))}
                      {rowAction ? (
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {rowAction(item)}
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              start={start + 1}
              end={end}
              total={totalItems}
              isRefreshing={Boolean(isFetching) && !isLoading}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </>
        )}
      </div>
    </div>
  );
}

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function hiddenBelowToClass(value?: "sm" | "md" | "lg") {
  switch (value) {
    case "sm":
      return "hidden sm:table-cell";
    case "md":
      return "hidden md:table-cell";
    case "lg":
      return "hidden lg:table-cell";
    default:
      return "";
  }
}

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.7}
          className="h-4 w-4"
        >
          <circle cx={11} cy={11} r={7} />
          <path strokeLinecap="round" d="m20 20-3.5-3.5" />
        </svg>
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
      />
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

function Pagination(props: PaginationProps) {
  const { currentPage, totalPages, start, end, total, isRefreshing, onPrev, onNext } =
    props;
  const fmt = (n: number) => n.toLocaleString("id-ID");

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-slate-600">
        Menampilkan{" "}
        <span className="font-medium text-slate-900">
          {fmt(start)}–{fmt(end)}
        </span>{" "}
        dari <span className="font-medium text-slate-900">{fmt(total)}</span>{" "}
        data{isRefreshing ? " · memperbarui..." : ""}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
        >
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
        </button>
      </div>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="divide-y divide-slate-100">
      <div className="bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Memuat data...
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
        </div>
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
      <p className="text-sm text-slate-600">
        Gagal memuat data. Silakan coba lagi.
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Coba lagi
        </button>
      ) : null}
    </div>
  );
}

function EmptyState({
  isSearching,
  search,
  emptyText,
}: {
  isSearching: boolean;
  search: string;
  emptyText: string;
}) {
  return (
    <div className="px-4 py-16 text-center text-sm text-slate-500">
      {isSearching
        ? `Tidak ditemukan data untuk "${search}".`
        : emptyText}
    </div>
  );
}
