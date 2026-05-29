"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import { usePeminjamanList } from "./peminjaman.queries";
import type { PeminjamanListItem } from "./peminjaman.types";

type PeminjamanSelectProps = {
  value: string;
  onChange: (id: string, item: PeminjamanListItem | null) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
};

export function PeminjamanSelect({
  value,
  onChange,
  label = "Peminjaman",
  error,
  disabled,
}: PeminjamanSelectProps) {
  const inputId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const list = usePeminjamanList();
  const items = useMemo(() => list.data?.data ?? [], [list.data]);

  const selected = useMemo(
    () => items.find((item) => item.id === value) ?? null,
    [items, value],
  );

  // Debounce
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 200);
    return () => clearTimeout(handle);
  }, [query]);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return items.slice(0, 20);
    return items
      .filter((item) =>
        `${item.nama_anggota ?? ""} ${item.jaminan} ${item.id_anggota}`
          .toLowerCase()
          .includes(debouncedQuery),
      )
      .slice(0, 20);
  }, [items, debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (item: PeminjamanListItem) => {
    onChange(item.id, item);
    setOpen(false);
    setQuery("");
  };

  const handleClear = () => {
    onChange("", null);
    setQuery("");
  };

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
        {label}
      </label>

      {value && selected ? (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              {selected.nama_anggota || "—"}
            </p>
            <p className="truncate text-xs text-slate-500">
              {formatDate(selected.tgl_pinjam)} → {formatDate(selected.tgl_hrs_kembali)} ·{" "}
              Jaminan {selected.jaminan}
            </p>
          </div>
          {!disabled ? (
            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
            >
              Ganti
            </button>
          ) : null}
        </div>
      ) : (
        <div className="relative">
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Cari berdasarkan nama anggota atau jaminan..."
            aria-invalid={error ? "true" : "false"}
            disabled={disabled || list.isLoading}
            autoComplete="off"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-200"
          />
          {open ? (
            <div
              role="listbox"
              className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg"
            >
              {list.isLoading ? (
                <p className="px-3 py-2 text-xs text-slate-500">
                  Memuat daftar peminjaman...
                </p>
              ) : list.isError ? (
                <p className="px-3 py-2 text-xs text-red-600">
                  Gagal memuat. Silakan coba lagi.
                </p>
              ) : filtered.length === 0 ? (
                <p className="px-3 py-2 text-xs text-slate-500">
                  Tidak ada peminjaman yang cocok.
                </p>
              ) : (
                filtered.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    role="option"
                    aria-selected="false"
                    onClick={() => handleSelect(item)}
                    className="flex w-full flex-col items-start px-3 py-2 text-left text-sm transition hover:bg-slate-100"
                  >
                    <span className="font-medium text-slate-900">
                      {item.nama_anggota || "—"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatDate(item.tgl_pinjam)} →{" "}
                      {formatDate(item.tgl_hrs_kembali)} · Jaminan{" "}
                      {item.jaminan}
                    </span>
                  </button>
                ))
              )}
            </div>
          ) : null}
        </div>
      )}

      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : (
        <p className="text-xs text-slate-500">
          Memilih peminjaman akan otomatis mengisi anggota dan tanggal.
        </p>
      )}
    </div>
  );
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
