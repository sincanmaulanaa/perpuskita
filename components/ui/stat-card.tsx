import Link from "next/link";
import type { ReactNode } from "react";

type StatCardTone = "default" | "brand" | "success" | "warning" | "danger";

type StatCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  href?: string;
  tone?: StatCardTone;
  isLoading?: boolean;
  isError?: boolean;
};

const toneClasses: Record<StatCardTone, string> = {
  default: "bg-slate-100 text-slate-600",
  brand: "bg-brand-50 text-brand-600",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-600",
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  href,
  tone = "default",
  isLoading,
  isError,
}: StatCardProps) {
  const content = (
    <article className="group h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        {icon ? (
          <span
            aria-hidden
            className={
              "flex h-8 w-8 items-center justify-center rounded-xl " +
              toneClasses[tone]
            }
          >
            {icon}
          </span>
        ) : null}
      </div>

      <div className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
        {isLoading ? (
          <span className="inline-block h-8 w-20 animate-pulse rounded bg-slate-200" />
        ) : isError ? (
          <span className="text-slate-400">—</span>
        ) : (
          value
        )}
      </div>

      {hint ? (
        <p className="mt-1 text-xs text-slate-500">
          {isError ? "Gagal memuat data." : hint}
        </p>
      ) : null}
    </article>
  );

  if (href && !isLoading && !isError) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }
  return content;
}
