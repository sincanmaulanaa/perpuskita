import { useMutation, useQueryClient } from "@tanstack/react-query";

import { penulisApi } from "./penulis.api";
import { penulisKeys } from "./penulis.queries";
import type {
  CreatePenulisPayload,
  UpdatePenulisPayload,
} from "./penulis.types";

export function useCreatePenulis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePenulisPayload) => penulisApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: penulisKeys.lists() });
    },
  });
}

export function useUpdatePenulis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePenulisPayload) => penulisApi.update(payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: penulisKeys.lists() });
      qc.invalidateQueries({ queryKey: penulisKeys.detail(variables.id) });
    },
  });
}

export function useDeletePenulis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => penulisApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: penulisKeys.lists() });
    },
  });
}
