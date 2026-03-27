import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../lib/utils";

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50",
        variant === "primary" &&
          "bg-cyan-400 text-slate-950 hover:translate-y-[-1px] hover:shadow-lg hover:shadow-cyan-400/30",
        variant === "secondary" &&
          "bg-slate-800 text-white hover:bg-slate-700",
        variant === "ghost" && "bg-transparent text-cyan-300 hover:bg-slate-900",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}