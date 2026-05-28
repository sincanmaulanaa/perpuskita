import { useQuery } from "@tanstack/react-query";

import { jenisBukuApi } from "./jenis-buku.api";

export const jenisBukuKeys = {
  all: ["jenis-buku"] as const,
  lists: () => [...jenisBukuKeys.all, "list"] as const,
  details: () => [...jenisBukuKeys.all, "detail"] as const,
  detail: (id: string) => [...jenisBukuKeys.details(), id] as const,
};

export function useJenisBukuList() {
  return useQuery({
    queryKey: jenisBukuKeys.lists(),
    queryFn: ({ signal }) => jenisBukuApi.list(signal),
  });
}

export function useJenisBukuById(id: string) {
  return useQuery({
    queryKey: jenisBukuKeys.detail(id),
    queryFn: ({ signal }) => jenisBukuApi.byId(id, signal),
    enabled: Boolean(id),
  });
}
