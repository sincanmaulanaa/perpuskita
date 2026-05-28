"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { useAuthStore } from "./auth.store";

const subscribeHydration = (callback: () => void) =>
  useAuthStore.persist.onFinishHydration(callback);

const getHydrated = () => useAuthStore.persist.hasHydrated();
const getHydratedServer = () => false;

/**
 * Wait for the persisted auth store to rehydrate, then redirect to
 * `/login` if there is no active session. Returns flags that the
 * caller can use to render a loading state until hydration completes.
 */
export function useAuthGuard() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useSyncExternalStore(
    subscribeHydration,
    getHydrated,
    getHydratedServer,
  );

  useEffect(() => {
    if (hasHydrated && !token) {
      router.replace("/login");
    }
  }, [hasHydrated, token, router]);

  return {
    hasHydrated,
    isAuthenticated: Boolean(token),
  };
}
