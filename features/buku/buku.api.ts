import { api } from "@/lib/axios";

import type { BukuListResponse } from "./buku.types";

export const bukuApi = {
  async list(signal?: AbortSignal): Promise<BukuListResponse> {
    const { data } = await api.get<BukuListResponse>("/buku/", { signal });
    return data;
  },
};
