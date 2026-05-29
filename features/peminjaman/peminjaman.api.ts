import { api } from "@/lib/axios";

import type {
  CreatePeminjamanPayload,
  PeminjamanDetailResponse,
  PeminjamanItemResponse,
  PeminjamanListResponse,
  UpdatePeminjamanPayload,
} from "./peminjaman.types";

export const peminjamanApi = {
  async list(signal?: AbortSignal): Promise<PeminjamanListResponse> {
    const { data } = await api.get<PeminjamanListResponse>(
      "/admin/peminjaman/",
      { signal },
    );
    return data;
  },

  async byId(
    id: string,
    signal?: AbortSignal,
  ): Promise<PeminjamanItemResponse> {
    const { data } = await api.get<PeminjamanItemResponse>(
      `/admin/peminjaman/${id}`,
      { signal },
    );
    return data;
  },

  async detail(
    id: string,
    signal?: AbortSignal,
  ): Promise<PeminjamanDetailResponse> {
    const { data } = await api.get<PeminjamanDetailResponse>(
      `/admin/peminjaman/detail/${id}`,
      { signal },
    );
    return data;
  },

  async create(payload: CreatePeminjamanPayload): Promise<void> {
    await api.post("/admin/peminjaman/create", payload);
  },

  async update(payload: UpdatePeminjamanPayload): Promise<void> {
    await api.put("/admin/peminjaman/update", payload);
  },

  async remove(id: string): Promise<void> {
    await api.delete("/admin/peminjaman/delete", {
      data: { id_peminjaman: id },
    });
  },
};
