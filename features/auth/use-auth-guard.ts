"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuthStore } from "./auth.store";

/**
 * Wait for the persisted auth store to rehydrate, then redirect to
 * `/login` if there is no active session. Returns flags that the
 * caller can use to render a loading state until hydration completes.
 */
export function useAuthGuard() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(useAuthStore.persist.hasHydrated());
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return unsubscribe;
  }, []);

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
