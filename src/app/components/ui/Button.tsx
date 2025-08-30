import type { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

export default function Button({
  children,
  variant = "primary",
  className,
  ...rest
}: Props) {
  return (
    <button
      className={clsx(
        "rounded-xl px-3 py-2 text-sm font-medium transition",
        variant === "primary" &&
          "bg-slate-700 hover:bg-slate-600 text-white ring-1 ring-slate-600",
        variant === "ghost" &&
          "bg-slate-800/70 hover:bg-slate-700/80 text-slate-100 ring-1 ring-slate-700",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
