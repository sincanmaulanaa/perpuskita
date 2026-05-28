"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { useLogout } from "@/features/auth/auth.mutations";
import { useAuthStore } from "@/features/auth/auth.store";
import { useAuthGuard } from "@/features/auth/use-auth-guard";

import { AdminSidebar } from "./admin-sidebar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const { hasHydrated, isAuthenticated } = useAuthGuard();
  const username = useAuthStore((state) => state.username);
  const logout = useLogout();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <Brand />
        <AdminSidebar />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div
          className="fixed inset-0 z-40 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
        >
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-slate-900/50"
          />
          <aside className="relative flex h-full w-64 flex-col bg-white shadow-xl">
            <Brand />
            <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      ) : null}

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Buka menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 md:hidden"
            >
              <MenuIcon />
            </button>

            <div className="flex flex-1 items-center justify-end gap-3">
              {username ? (
                <span className="hidden text-sm text-slate-500 sm:inline">
                  Halo,{" "}
                  <span className="font-medium text-slate-900">
                    {username}
                  </span>
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
    </div>
  );
}

function Brand() {
  return (
    <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
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
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-5 w-5"
      aria-hidden
    >
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
