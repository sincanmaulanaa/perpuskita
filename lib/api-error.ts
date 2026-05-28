import { AxiosError, isAxiosError } from "axios";

/**
 * Normalized error shape used by all UI code. The HTTP layer always
 * converts axios/network errors into this so consumers never branch
 * on raw axios internals.
 */
export type ApiError = {
  status: number;
  message: string;
  code?: string;
};

/** Backend response envelope for failures: `{ error: true, msg: string }`. */
type ApiErrorBody = {
  error?: boolean;
  msg?: string;
  message?: string;
};

export function toApiError(err: unknown): ApiError {
  if (isAxiosError(err)) {
    return fromAxios(err);
  }

  if (err instanceof Error) {
    return { status: 0, message: err.message };
  }

  return { status: 0, message: "Unknown error" };
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    "message" in value
  );
}

/**
 * Map an unknown thrown value to a user-friendly Indonesian message.
 * Returns the supplied fallback for non-network errors so messages
 * stay non-technical at the call site.
 */
export function getFriendlyMessage(
  err: unknown,
  fallback: string,
): string {
  if (!isApiError(err)) return fallback;
  if (err.status === 0) {
    return "Koneksi bermasalah. Periksa jaringan Anda.";
  }
  // Detect MySQL/GORM foreign-key constraint leaks coming through the
  // backend so the UI never shows raw SQL errors to end users.
  if (err.message?.toLowerCase().includes("foreign key")) {
    return "Tidak bisa dihapus karena masih digunakan oleh data lain.";
  }
  return fallback;
}

function fromAxios(err: AxiosError<ApiErrorBody>): ApiError {
  const status = err.response?.status ?? 0;
  const data = err.response?.data;

  const message =
    data?.msg ??
    data?.message ??
    err.message ??
    "Request failed";

  return {
    status,
    message,
    code: err.code,
  };
}
