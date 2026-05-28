"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { isApiError } from "@/lib/api-error";

import { useLogin } from "./auth.mutations";
import { selectIsAuthenticated, useAuthStore } from "./auth.store";

const REDIRECT_AFTER_LOGIN = "/";

export function LoginForm() {
  const router = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const { mutate, isPending, error, reset } = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // If the user is already authenticated, send them away.
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(REDIRECT_AFTER_LOGIN);
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    mutate(
      { username: username.trim(), password },
      {
        onSuccess: () => {
          router.replace(REDIRECT_AFTER_LOGIN);
        },
      },
    );
  };

  const errorMessage = isApiError(error) ? error.message : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="username"
          className="text-sm font-medium text-slate-700"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
            if (errorMessage) reset();
          }}
          disabled={isPending}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="admin"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (errorMessage) reset();
          }}
          disabled={isPending}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="••••••••"
        />
      </div>

      {errorMessage ? (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending || !username || !password}
        className="mt-2 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isPending ? "Memverifikasi..." : "Masuk"}
      </button>
    </form>
  );
}
