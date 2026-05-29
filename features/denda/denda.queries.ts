import { useQuery } from "@tanstack/react-query";

import { dendaApi } from "./denda.api";

export const dendaKeys = {
  all: ["denda"] as const,
  lists: () => [...dendaKeys.all, "list"] as const,
  details: () => [...dendaKeys.all, "detail"] as const,
  detail: (id: string) => [...dendaKeys.details(), id] as const,
};

export function useDendaList() {
  return useQuery({
    queryKey: dendaKeys.lists(),
    queryFn: ({ signal }) => dendaApi.list(signal),
  });
}

export function useDendaById(id: string) {
  return useQuery({
    queryKey: dendaKeys.detail(id),
    queryFn: ({ signal }) => dendaApi.byId(id, signal),
    enabled: Boolean(id),
  });
}
