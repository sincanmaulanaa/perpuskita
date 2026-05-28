import { useMutation, useQueryClient } from "@tanstack/react-query";

import { penerbitApi } from "./penerbit.api";
import { penerbitKeys } from "./penerbit.queries";
import type {
  CreatePenerbitPayload,
  UpdatePenerbitPayload,
} from "./penerbit.types";

export function useCreatePenerbit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePenerbitPayload) =>
      penerbitApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: penerbitKeys.lists() });
    },
  });
}

export function useUpdatePenerbit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePenerbitPayload) =>
      penerbitApi.update(payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: penerbitKeys.lists() });
      qc.invalidateQueries({ queryKey: penerbitKeys.detail(variables.id) });
    },
  });
}

export function useDeletePenerbit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => penerbitApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: penerbitKeys.lists() });
    },
  });
}
