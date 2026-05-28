import { api } from "@/lib/axios";

import type { LoginPayload, LoginResponse } from "./auth.types";

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/login", payload);
    return data;
  },
};
