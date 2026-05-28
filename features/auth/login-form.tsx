"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { isApiError } from "@/lib/api-error";

import { useLogin } from "./auth.mutations";
import { selectIsAuthenticated, useAuthStore } from "./auth.store";
import { loginSchema, type LoginFormValues } from "./login.schema";

const REDIRECT_AFTER_LOGIN = "/";

export function LoginForm() {
  const router = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const { mutateAsync, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(REDIRECT_AFTER_LOGIN);
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await mutateAsync(values);
      toast.success("Selamat datang kembali.");
      router.replace(REDIRECT_AFTER_LOGIN);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="username"
          className="text-sm font-medium text-slate-700"
        >
          Nama Pengguna
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          autoFocus
          placeholder="contoh: admin"
          aria-invalid={errors.username ? "true" : "false"}
          disabled={isPending}
          {...register("username")}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-200"
        />
        {errors.username ? (
          <p className="text-xs text-red-600">{errors.username.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-700"
        >
          Kata Sandi
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={errors.password ? "true" : "false"}
          disabled={isPending}
          {...register("password")}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-200"
        />
        {errors.password ? (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isPending ? "Sedang masuk..." : "Masuk"}
      </button>
    </form>
  );
}

function getFriendlyErrorMessage(err: unknown): string {
  if (!isApiError(err)) {
    return "Tidak dapat masuk saat ini. Silakan coba lagi.";
  }

  if (err.status === 401) {
    return "Nama pengguna atau kata sandi salah.";
  }

  if (err.status === 0) {
    return "Koneksi bermasalah. Periksa jaringan Anda.";
  }

  return "Tidak dapat masuk saat ini. Silakan coba lagi.";
}
