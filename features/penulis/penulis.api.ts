import { api } from "@/lib/axios";

import type { PenulisListResponse } from "./penulis.types";

export const penulisApi = {
  async list(signal?: AbortSignal): Promise<PenulisListResponse> {
    const { data } = await api.get<PenulisListResponse>(
      "/admin/buku/author/",
      { signal },
    );
    return data;
  },
};
