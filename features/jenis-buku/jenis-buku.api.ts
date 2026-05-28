import { api } from "@/lib/axios";

import type {
  CreateJenisBukuPayload,
  JenisBuku,
  JenisBukuDetailResponse,
  JenisBukuListResponse,
  UpdateJenisBukuPayload,
} from "./jenis-buku.types";

export const jenisBukuApi = {
  async list(signal?: AbortSignal): Promise<JenisBukuListResponse> {
    const { data } = await api.get<JenisBukuListResponse>(
      "/admin/buku/jenbuk/",
      { signal },
    );
    return data;
  },

  async byId(id: string, signal?: AbortSignal): Promise<JenisBukuDetailResponse> {
    const { data } = await api.get<JenisBukuDetailResponse>(
      `/admin/buku/jenbuk/${id}`,
      { signal },
    );
    return data;
  },

  async create(payload: CreateJenisBukuPayload): Promise<JenisBuku> {
    const { data } = await api.post<{ data: JenisBuku }>(
      "/admin/buku/jenbuk/create",
      payload,
    );
    return data.data;
  },

  async update(payload: UpdateJenisBukuPayload): Promise<JenisBuku> {
    const { data } = await api.put<{ data: JenisBuku }>(
      "/admin/buku/jenbuk/update",
      payload,
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete("/admin/buku/jenbuk/delete", { data: { id } });
  },
};
