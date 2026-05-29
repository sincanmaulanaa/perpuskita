import { forwardRef, type TextareaHTMLAttributes } from "react";

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField({ label, error, hint, id, className, ...rest }, ref) {
    const inputId = id ?? rest.name ?? label;
    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </label>
        <textarea
          id={inputId}
          ref={ref}
          rows={4}
          aria-invalid={error ? "true" : "false"}
          className={
            "rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-200 " +
            (className ?? "")
          }
          {...rest}
        />
        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : hint ? (
          <p className="text-xs text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);
