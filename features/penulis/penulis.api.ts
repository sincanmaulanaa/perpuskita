import { api } from "@/lib/axios";

import type {
  CreatePenulisPayload,
  Penulis,
  PenulisDetailResponse,
  PenulisListResponse,
  UpdatePenulisPayload,
} from "./penulis.types";

export const penulisApi = {
  async list(signal?: AbortSignal): Promise<PenulisListResponse> {
    const { data } = await api.get<PenulisListResponse>(
      "/admin/buku/author/",
      { signal },
    );
    return data;
  },

  async byId(id: string, signal?: AbortSignal): Promise<PenulisDetailResponse> {
    const { data } = await api.get<PenulisDetailResponse>(
      `/admin/buku/author/${id}`,
      { signal },
    );
    return data;
  },

  async create(payload: CreatePenulisPayload): Promise<Penulis> {
    const { data } = await api.post<{ data: Penulis }>(
      "/admin/buku/author/create",
      payload,
    );
    return data.data;
  },

  async update(payload: UpdatePenulisPayload): Promise<Penulis> {
    const { data } = await api.put<{ data: Penulis }>(
      "/admin/buku/author/update",
      payload,
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete("/admin/buku/author/delete", { data: { id } });
  },
};
