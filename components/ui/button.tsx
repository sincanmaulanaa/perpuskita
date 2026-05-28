import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md";
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:text-slate-400",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:text-slate-400",
  destructive:
    "border border-red-200 bg-white text-red-600 hover:bg-red-50 disabled:text-red-300",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", className, type = "button", ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={
          "inline-flex items-center justify-center rounded-lg font-medium transition disabled:cursor-not-allowed " +
          variantClasses[variant] +
          " " +
          sizeClasses[size] +
          " " +
          (className ?? "")
        }
        {...rest}
      />
    );
  },
);
