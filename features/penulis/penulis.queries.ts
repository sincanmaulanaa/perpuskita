import { useQuery } from "@tanstack/react-query";

import { penulisApi } from "./penulis.api";

export const penulisKeys = {
  all: ["penulis"] as const,
  lists: () => [...penulisKeys.all, "list"] as const,
};

export function usePenulisList() {
  return useQuery({
    queryKey: penulisKeys.lists(),
    queryFn: ({ signal }) => penulisApi.list(signal),
  });
}
