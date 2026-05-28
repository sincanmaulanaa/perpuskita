import { api } from "@/lib/axios";

import type { BukuDetailResponse, BukuListResponse } from "./buku.types";

export const bukuApi = {
  async list(signal?: AbortSignal): Promise<BukuListResponse> {
    const { data } = await api.get<BukuListResponse>("/buku/", { signal });
    return data;
  },

  async byId(id: string, signal?: AbortSignal): Promise<BukuDetailResponse> {
    const { data } = await api.get<BukuDetailResponse>(`/buku/${id}`, {
      signal,
    });
    return data;
  },
};
