import { api } from "@/lib/axios";

import type {
  CreateDendaPayload,
  DendaItemResponse,
  DendaListResponse,
  UpdateDendaPayload,
} from "./denda.types";

export const dendaApi = {
  async list(signal?: AbortSignal): Promise<DendaListResponse> {
    const { data } = await api.get<DendaListResponse>("/admin/denda/", {
      signal,
    });
    return data;
  },

  async byId(id: string, signal?: AbortSignal): Promise<DendaItemResponse> {
    const { data } = await api.get<DendaItemResponse>(`/admin/denda/${id}`, {
      signal,
    });
    return data;
  },

  async create(payload: CreateDendaPayload): Promise<void> {
    await api.post("/admin/denda/create", payload);
  },

  async update(payload: UpdateDendaPayload): Promise<void> {
    await api.put("/admin/denda/update", payload);
  },

  async remove(id: string): Promise<void> {
    await api.delete("/admin/denda/delete", {
      data: { id_denda: id },
    });
  },
};
