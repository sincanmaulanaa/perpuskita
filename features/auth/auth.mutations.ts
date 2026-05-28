import { useMutation } from "@tanstack/react-query";

import { authApi } from "./auth.api";
import { useAuthStore } from "./auth.store";
import type { LoginPayload } from "./auth.types";

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (response) => {
      setSession({
        username: response.data.username,
        token: response.data.token,
        refreshToken: response.data.refresh_token,
      });
    },
  });
}

export function useLogout() {
  const clear = useAuthStore((state) => state.clear);
  return () => clear();
}
