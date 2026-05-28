import { useQuery } from "@tanstack/react-query";

import { penerbitApi } from "./penerbit.api";

export const penerbitKeys = {
  all: ["penerbit"] as const,
  lists: () => [...penerbitKeys.all, "list"] as const,
  details: () => [...penerbitKeys.all, "detail"] as const,
  detail: (id: string) => [...penerbitKeys.details(), id] as const,
};

export function usePenerbitList() {
  return useQuery({
    queryKey: penerbitKeys.lists(),
    queryFn: ({ signal }) => penerbitApi.list(signal),
  });
}

export function usePenerbitById(id: string) {
  return useQuery({
    queryKey: penerbitKeys.detail(id),
    queryFn: ({ signal }) => penerbitApi.byId(id, signal),
    enabled: Boolean(id),
  });
}
