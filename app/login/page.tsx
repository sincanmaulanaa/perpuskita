import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Masuk · Perpuskita",
  description: "Masuk ke sistem informasi perpustakaan Perpuskita.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
          <header className="mb-8 flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Perpuskita
            </h1>
            <p className="text-sm text-slate-500">
              Masuk ke sistem informasi perpustakaan
            </p>
          </header>

          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Akses panel pegawai. Hubungi administrator untuk akun baru.
        </p>
      </div>
    </main>
  );
}
