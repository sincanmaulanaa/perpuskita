import { useQuery } from "@tanstack/react-query";

import { penerbitApi } from "./penerbit.api";

export const penerbitKeys = {
  all: ["penerbit"] as const,
  lists: () => [...penerbitKeys.all, "list"] as const,
};

export function usePenerbitList() {
  return useQuery({
    queryKey: penerbitKeys.lists(),
    queryFn: ({ signal }) => penerbitApi.list(signal),
  });
}
