import { useQuery } from "@tanstack/react-query";

import { anggotaApi } from "./anggota.api";

export const anggotaKeys = {
  all: ["anggota"] as const,
  lists: () => [...anggotaKeys.all, "list"] as const,
  search: (keyword: string) =>
    [...anggotaKeys.all, "search", keyword] as const,
  details: () => [...anggotaKeys.all, "detail"] as const,
  detail: (id: string) => [...anggotaKeys.details(), id] as const,
};

export function useAnggotaList() {
  return useQuery({
    queryKey: anggotaKeys.lists(),
    queryFn: ({ signal }) => anggotaApi.list(signal),
  });
}

export function useAnggotaSearch(keyword: string) {
  const trimmed = keyword.trim();
  return useQuery({
    queryKey: anggotaKeys.search(trimmed),
    queryFn: ({ signal }) => anggotaApi.search(trimmed, signal),
    enabled: trimmed.length >= 2,
    staleTime: 60_000,
  });
}

export function useAnggotaById(id: string) {
  return useQuery({
    queryKey: anggotaKeys.detail(id),
    queryFn: ({ signal }) => anggotaApi.byId(id, signal),
    enabled: Boolean(id),
  });
}
