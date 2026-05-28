import { api } from "@/lib/axios";

import type { PenerbitListResponse } from "./penerbit.types";

export const penerbitApi = {
  async list(signal?: AbortSignal): Promise<PenerbitListResponse> {
    const { data } = await api.get<PenerbitListResponse>(
      "/admin/buku/penbuk/",
      { signal },
    );
    return data;
  },
};
