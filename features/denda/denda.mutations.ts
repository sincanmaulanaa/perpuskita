import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dendaApi } from "./denda.api";
import { dendaKeys } from "./denda.queries";
import type { CreateDendaPayload, UpdateDendaPayload } from "./denda.types";

export function useCreateDenda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDendaPayload) => dendaApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: dendaKeys.lists() });
    },
  });
}

export function useUpdateDenda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateDendaPayload) => dendaApi.update(payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: dendaKeys.lists() });
      qc.invalidateQueries({ queryKey: dendaKeys.detail(variables.id_denda) });
    },
  });
}

export function useDeleteDenda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dendaApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: dendaKeys.lists() });
    },
  });
}
