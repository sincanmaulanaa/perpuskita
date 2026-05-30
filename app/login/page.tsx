import type { Metadata } from "next";
import Image from "next/image";

import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke sistem informasi perpustakaan Perpuskita.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
          <header className="mb-8 flex flex-col items-center gap-4 text-center">
            <Image
              src="/logo/perpuskita-logo.png"
              alt="Perpuskita"
              width={600}
              height={394}
              priority
              className="h-14 w-auto"
            />
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Selamat datang
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Masuk untuk mengelola perpustakaan Anda.
              </p>
            </div>
          </header>

          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Hanya untuk pegawai. Hubungi administrator untuk membuat akun baru.
        </p>
      </div>
    </main>
  );
}
