"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [showPassword, setShowPassword] = useState(false);

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
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-200"
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
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={errors.password ? "true" : "false"}
            disabled={isPending}
            {...register("password")}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-11 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isPending}
            aria-label={
              showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
            }
            aria-pressed={showPassword}
            className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:bg-slate-100 focus:text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.password ? (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
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

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      className="h-4 w-4"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
      />
      <circle cx={12} cy={12} r={3} />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      className="h-4 w-4"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.6 6.2A10 10 0 0 1 12 6c6.5 0 10 7 10 7a17 17 0 0 1-3.1 3.9M6.2 7.5A17 17 0 0 0 2 13s3.5 7 10 7a10 10 0 0 0 4.3-1"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.5 9.7a3 3 0 0 0 4.3 4.2"
      />
    </svg>
  );
}
