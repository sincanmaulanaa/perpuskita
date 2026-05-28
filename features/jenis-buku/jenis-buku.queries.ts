import { useQuery } from "@tanstack/react-query";

import { jenisBukuApi } from "./jenis-buku.api";

export const jenisBukuKeys = {
  all: ["jenis-buku"] as const,
  lists: () => [...jenisBukuKeys.all, "list"] as const,
};

export function useJenisBukuList() {
  return useQuery({
    queryKey: jenisBukuKeys.lists(),
    queryFn: ({ signal }) => jenisBukuApi.list(signal),
  });
}
