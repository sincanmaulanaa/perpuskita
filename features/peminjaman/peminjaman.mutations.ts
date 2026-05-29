import { useMutation, useQueryClient } from "@tanstack/react-query";

import { peminjamanApi } from "./peminjaman.api";
import { peminjamanKeys } from "./peminjaman.queries";
import type {
  CreatePeminjamanPayload,
  UpdatePeminjamanPayload,
} from "./peminjaman.types";

export function useCreatePeminjaman() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePeminjamanPayload) =>
      peminjamanApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: peminjamanKeys.lists() });
    },
  });
}

export function useUpdatePeminjaman() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePeminjamanPayload) =>
      peminjamanApi.update(payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: peminjamanKeys.lists() });
      qc.invalidateQueries({
        queryKey: peminjamanKeys.detail(variables.id_peminjaman),
      });
      qc.invalidateQueries({
        queryKey: peminjamanKeys.fullDetail(variables.id_peminjaman),
      });
    },
  });
}

export function useDeletePeminjaman() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => peminjamanApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: peminjamanKeys.lists() });
    },
  });
}
