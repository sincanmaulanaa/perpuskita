import { useQuery } from "@tanstack/react-query";

import { peminjamanApi } from "./peminjaman.api";

export const peminjamanKeys = {
  all: ["peminjaman"] as const,
  lists: () => [...peminjamanKeys.all, "list"] as const,
  details: () => [...peminjamanKeys.all, "detail"] as const,
  detail: (id: string) => [...peminjamanKeys.details(), id] as const,
  fullDetail: (id: string) =>
    [...peminjamanKeys.all, "full-detail", id] as const,
};

export function usePeminjamanList() {
  return useQuery({
    queryKey: peminjamanKeys.lists(),
    queryFn: ({ signal }) => peminjamanApi.list(signal),
  });
}

export function usePeminjamanById(id: string) {
  return useQuery({
    queryKey: peminjamanKeys.detail(id),
    queryFn: ({ signal }) => peminjamanApi.byId(id, signal),
    enabled: Boolean(id),
  });
}

export function usePeminjamanFullDetail(id: string) {
  return useQuery({
    queryKey: peminjamanKeys.fullDetail(id),
    queryFn: ({ signal }) => peminjamanApi.detail(id, signal),
    enabled: Boolean(id),
  });
}
