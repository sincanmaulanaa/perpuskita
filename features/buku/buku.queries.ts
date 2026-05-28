import { useQuery } from "@tanstack/react-query";

import { bukuApi } from "./buku.api";

export const bukuKeys = {
  all: ["buku"] as const,
  lists: () => [...bukuKeys.all, "list"] as const,
  details: () => [...bukuKeys.all, "detail"] as const,
  detail: (id: string) => [...bukuKeys.details(), id] as const,
};

export function useBukuList() {
  return useQuery({
    queryKey: bukuKeys.lists(),
    queryFn: ({ signal }) => bukuApi.list(signal),
  });
}

export function useBukuById(id: string) {
  return useQuery({
    queryKey: bukuKeys.detail(id),
    queryFn: ({ signal }) => bukuApi.byId(id, signal),
    enabled: Boolean(id),
  });
}
