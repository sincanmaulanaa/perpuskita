import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuthSession } from "./auth.types";

type AuthState = {
  username: string | null;
  token: string | null;
  refreshToken: string | null;
  setSession: (session: AuthSession) => void;
  clear: () => void;
};

const initialState = {
  username: null,
  token: null,
  refreshToken: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setSession: ({ username, token, refreshToken }) =>
        set({ username, token, refreshToken }),
      clear: () => set(initialState),
    }),
    {
      name: "perpuskita-auth",
      // sessionStorage clears when the tab closes; safer than localStorage
      // for short-lived JWTs. For full XSS resistance, move tokens to
      // HttpOnly cookies on the backend and keep only `username` here.
      storage: createJSONStorage(() =>
        typeof window === "undefined"
          ? (undefined as unknown as Storage)
          : window.sessionStorage,
      ),
      partialize: (state) => ({
        username: state.username,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

export const selectIsAuthenticated = (state: AuthState) =>
  Boolean(state.token);
