import { api } from "@/lib/axios";

import type { JenisBukuListResponse } from "./jenis-buku.types";

export const jenisBukuApi = {
  async list(signal?: AbortSignal): Promise<JenisBukuListResponse> {
    const { data } = await api.get<JenisBukuListResponse>(
      "/admin/buku/jenbuk/",
      { signal },
    );
    return data;
  },
};
