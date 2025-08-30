import type { ReactNode } from "react";
import { clsx } from "clsx";

export default function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-slate-900 p-4 shadow-sm ring-1 ring-slate-800",
        className,
      )}
    >
      {children}
    </div>
  );
}
