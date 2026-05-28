import { useQuery } from "@tanstack/react-query";

import { penulisApi } from "./penulis.api";

export const penulisKeys = {
  all: ["penulis"] as const,
  lists: () => [...penulisKeys.all, "list"] as const,
  details: () => [...penulisKeys.all, "detail"] as const,
  detail: (id: string) => [...penulisKeys.details(), id] as const,
};

export function usePenulisList() {
  return useQuery({
    queryKey: penulisKeys.lists(),
    queryFn: ({ signal }) => penulisApi.list(signal),
  });
}

export function usePenulisById(id: string) {
  return useQuery({
    queryKey: penulisKeys.detail(id),
    queryFn: ({ signal }) => penulisApi.byId(id, signal),
    enabled: Boolean(id),
  });
}
