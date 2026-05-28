import { api } from "@/lib/axios";

import type {
  CreatePenerbitPayload,
  Penerbit,
  PenerbitDetailResponse,
  PenerbitListResponse,
  UpdatePenerbitPayload,
} from "./penerbit.types";

export const penerbitApi = {
  async list(signal?: AbortSignal): Promise<PenerbitListResponse> {
    const { data } = await api.get<PenerbitListResponse>(
      "/admin/buku/penbuk/",
      { signal },
    );
    return data;
  },

  async byId(
    id: string,
    signal?: AbortSignal,
  ): Promise<PenerbitDetailResponse> {
    const { data } = await api.get<PenerbitDetailResponse>(
      `/admin/buku/penbuk/${id}`,
      { signal },
    );
    return data;
  },

  async create(payload: CreatePenerbitPayload): Promise<Penerbit> {
    const { data } = await api.post<{ data: Penerbit }>(
      "/admin/buku/penbuk/create",
      payload,
    );
    return data.data;
  },

  async update(payload: UpdatePenerbitPayload): Promise<Penerbit> {
    const { data } = await api.put<{ data: Penerbit }>(
      "/admin/buku/penbuk/update",
      payload,
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete("/admin/buku/penbuk/delete", { data: { id } });
  },
};
