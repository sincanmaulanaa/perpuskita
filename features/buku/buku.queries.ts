import { useQuery } from "@tanstack/react-query";

import { bukuApi } from "./buku.api";

export const bukuKeys = {
  all: ["buku"] as const,
  lists: () => [...bukuKeys.all, "list"] as const,
};

export function useBukuList() {
  return useQuery({
    queryKey: bukuKeys.lists(),
    queryFn: ({ signal }) => bukuApi.list(signal),
  });
}
