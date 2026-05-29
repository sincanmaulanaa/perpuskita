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
  emptyAction?: ReactNode;
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
  emptyAction,
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
          <TableSkeleton columns={columns} hasRowAction={Boolean(rowAction)} />
        ) : isError ? (
          <ErrorState onRetry={onRetry} />
        ) : totalItems === 0 ? (
          <EmptyState
            isSearching={Boolean(debouncedSearch)}
            search={debouncedSearch}
            emptyText={emptyText}
            emptyAction={emptyAction}
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
        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
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

type TableSkeletonProps<T> = {
  columns: DataTableColumn<T>[];
  hasRowAction: boolean;
};

function TableSkeleton<T>({ columns, hasRowAction }: TableSkeletonProps<T>) {
  return (
    <div className="overflow-x-auto" aria-busy="true" aria-live="polite">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-4 py-3 w-12 text-right">
              <div className="ml-auto h-3 w-4 rounded bg-slate-200" />
            </th>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={cn(
                  "px-4 py-3",
                  column.align === "right" && "text-right",
                  hiddenBelowToClass(column.hiddenBelow),
                )}
              >
                <div
                  className={cn(
                    "h-3 w-20 rounded bg-slate-200",
                    column.align === "right" && "ml-auto",
                  )}
                />
              </th>
            ))}
            {hasRowAction ? (
              <th scope="col" className="px-4 py-3 w-20 text-right">
                <div className="ml-auto h-3 w-12 rounded bg-slate-200" />
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {Array.from({ length: 6 }).map((_, rowIdx) => (
            <tr key={rowIdx} className="animate-pulse">
              <td className="px-4 py-3 text-right">
                <div className="ml-auto h-3 w-4 rounded bg-slate-200" />
              </td>
              {columns.map((column, colIdx) => (
                <td
                  key={column.id}
                  className={cn(
                    "px-4 py-3",
                    column.align === "right" && "text-right",
                    hiddenBelowToClass(column.hiddenBelow),
                  )}
                >
                  <div
                    className={cn(
                      "h-3 rounded bg-slate-200",
                      column.align === "right" && "ml-auto",
                      colIdx === 0 ? "w-3/4" : "w-1/2",
                    )}
                  />
                </td>
              ))}
              {hasRowAction ? (
                <td className="px-4 py-3 text-right">
                  <div className="ml-auto h-6 w-16 rounded bg-slate-200" />
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
      <span
        aria-hidden
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          className="h-5 w-5"
        >
          <circle cx={12} cy={12} r={9} />
          <path strokeLinecap="round" d="M12 8v5m0 3v.01" />
        </svg>
      </span>
      <div>
        <p className="text-sm font-medium text-slate-900">
          Tidak bisa memuat data
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Periksa koneksi Anda dan coba lagi.
        </p>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Coba lagi
        </button>
      ) : null}
    </div>
  );
}

type EmptyStateProps = {
  isSearching: boolean;
  search: string;
  emptyText: string;
  emptyAction?: ReactNode;
};

function EmptyState({
  isSearching,
  search,
  emptyText,
  emptyAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
      <span
        aria-hidden
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"
      >
        {isSearching ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            className="h-5 w-5"
          >
            <circle cx={11} cy={11} r={7} />
            <path strokeLinecap="round" d="m20 20-3.5-3.5" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 7h16l-2 12H6L4 7Z"
            />
            <path strokeLinecap="round" d="M9 7V5a3 3 0 0 1 6 0v2" />
          </svg>
        )}
      </span>
      <div className="max-w-sm">
        <p className="text-sm font-medium text-slate-900">
          {isSearching ? "Tidak ada hasil yang cocok" : "Belum ada data"}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {isSearching
            ? `Coba kata kunci lain selain "${search}".`
            : emptyText}
        </p>
      </div>
      {!isSearching && emptyAction ? <div>{emptyAction}</div> : null}
    </div>
  );
}
