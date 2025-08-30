import type { InputHTMLAttributes } from "react";
import { clsx } from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement> & { className?: string };

export default function Input({ className, ...rest }: Props) {
  return (
    <input
      {...rest}
      className={clsx(
        "w-full rounded-xl bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400",
        "ring-1 ring-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none",
        className,
      )}
    />
  );
}
