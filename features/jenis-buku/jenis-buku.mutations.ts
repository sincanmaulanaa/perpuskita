import { useMutation, useQueryClient } from "@tanstack/react-query";

import { jenisBukuApi } from "./jenis-buku.api";
import { jenisBukuKeys } from "./jenis-buku.queries";
import type {
  CreateJenisBukuPayload,
  UpdateJenisBukuPayload,
} from "./jenis-buku.types";

export function useCreateJenisBuku() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateJenisBukuPayload) =>
      jenisBukuApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: jenisBukuKeys.lists() });
    },
  });
}

export function useUpdateJenisBuku() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateJenisBukuPayload) =>
      jenisBukuApi.update(payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: jenisBukuKeys.lists() });
      qc.invalidateQueries({
        queryKey: jenisBukuKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteJenisBuku() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jenisBukuApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: jenisBukuKeys.lists() });
    },
  });
}
