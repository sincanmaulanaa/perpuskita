"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { useLogout } from "@/features/auth/auth.mutations";
import { useAuthStore } from "@/features/auth/auth.store";
import { useAuthGuard } from "@/features/auth/use-auth-guard";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const { hasHydrated, isAuthenticated } = useAuthGuard();
  const username = useAuthStore((state) => state.username);
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    toast.success("Anda telah keluar.");
    router.replace("/login");
  };

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Memuat...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div
              aria-hidden
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="h-5 w-5"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6.5v12a1 1 0 0 0 1 1h6V5H6.5A2.5 2.5 0 0 0 4 6.5Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 6.5v12a1 1 0 0 1-1 1h-6V5h4.5A2.5 2.5 0 0 1 20 6.5Z"
                />
              </svg>
            </div>
            <span className="text-base font-semibold tracking-tight text-slate-900">
              Perpuskita
            </span>
          </div>

          <div className="flex items-center gap-3">
            {username ? (
              <span className="hidden text-sm text-slate-500 sm:inline">
                Halo,{" "}
                <span className="font-medium text-slate-900">{username}</span>
              </span>
            ) : null}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
