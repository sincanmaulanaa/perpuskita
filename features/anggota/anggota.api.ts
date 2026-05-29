import { api } from "@/lib/axios";

import type {
  AnggotaDetailResponse,
  AnggotaListResponse,
} from "./anggota.types";

export const anggotaApi = {
  async list(signal?: AbortSignal): Promise<AnggotaListResponse> {
    const { data } = await api.get<AnggotaListResponse>("/admin/anggota/", {
      signal,
    });
    return data;
  },

  async search(
    keyword: string,
    signal?: AbortSignal,
  ): Promise<AnggotaListResponse> {
    const { data } = await api.get<AnggotaListResponse>("/admin/anggota/", {
      params: { q: keyword },
      signal,
    });
    return data;
  },

  async byId(id: string, signal?: AbortSignal): Promise<AnggotaDetailResponse> {
    const { data } = await api.get<AnggotaDetailResponse>(
      `/admin/anggota/${id}`,
      { signal },
    );
    return data;
  },
};
