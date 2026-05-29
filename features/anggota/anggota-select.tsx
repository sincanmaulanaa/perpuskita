"use client";

import { useEffect, useId, useRef, useState } from "react";

import { useAnggotaById, useAnggotaSearch } from "./anggota.queries";

type AnggotaSelectProps = {
  value: string;
  onChange: (id: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
};

export function AnggotaSelect({
  value,
  onChange,
  label = "Anggota",
  error,
  disabled,
  placeholder = "Cari nama atau username...",
}: AnggotaSelectProps) {
  const inputId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // When a value is set externally, fetch its display info.
  const selectedQuery = useAnggotaById(value);
  const selected = selectedQuery.data?.data;

  // Debounce the search input.
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => clearTimeout(handle);
  }, [query]);

  const searchQuery = useAnggotaSearch(debouncedQuery);
  const results = searchQuery.data?.data ?? [];

  // Close dropdown on outside click.
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

  const handleSelect = (id: string) => {
    onChange(id);
    setOpen(false);
    setQuery("");
  };

  const handleClear = () => {
    onChange("");
    setQuery("");
  };

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      {value && selected ? (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              {selected.nama}
            </p>
            <p className="truncate text-xs text-slate-500">
              <span className="font-mono">{selected.username}</span> ·{" "}
              {selected.email}
            </p>
          </div>
          {!disabled ? (
            <button
              type="button"
              onClick={handleClear}
              className="ml-3 shrink-0 rounded-md px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
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
            placeholder={placeholder}
            aria-invalid={error ? "true" : "false"}
            disabled={disabled}
            autoComplete="off"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-200"
          />
          {open && debouncedQuery.length >= 2 ? (
            <div
              role="listbox"
              className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg"
            >
              {searchQuery.isLoading ? (
                <p className="px-3 py-2 text-xs text-slate-500">Memuat...</p>
              ) : results.length === 0 ? (
                <p className="px-3 py-2 text-xs text-slate-500">
                  Tidak ada anggota yang cocok.
                </p>
              ) : (
                results.map((anggota) => (
                  <button
                    type="button"
                    key={anggota.id_anggota}
                    role="option"
                    aria-selected="false"
                    onClick={() => handleSelect(anggota.id_anggota)}
                    className="flex w-full flex-col items-start px-3 py-2 text-left text-sm transition hover:bg-slate-100"
                  >
                    <span className="font-medium text-slate-900">
                      {anggota.nama}
                    </span>
                    <span className="text-xs text-slate-500">
                      <span className="font-mono">{anggota.username}</span> ·{" "}
                      {anggota.email}
                    </span>
                  </button>
                ))
              )}
            </div>
          ) : open && debouncedQuery.length < 2 ? (
            <p className="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-lg">
              Ketik minimal 2 karakter untuk mencari.
            </p>
          ) : null}
        </div>
      )}

      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : (
        <p className="text-xs text-slate-500">
          Cari berdasarkan nama, username, atau email.
        </p>
      )}
    </div>
  );
}
