import axios from "axios";

import { useAuthStore } from "@/features/auth/auth.store";
import { toApiError } from "./api-error";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8001/api/v1";

export const api = axios.create({
  baseURL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().clear();
    }
    return Promise.reject(toApiError(error));
  },
);
