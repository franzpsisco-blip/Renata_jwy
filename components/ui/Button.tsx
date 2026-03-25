import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  const styles =
    variant === "primary"
      ? "bg-ink text-parchment hover:opacity-90"
      : variant === "secondary"
      ? "bg-parchment text-ink border border-black/10 hover:bg-black/5"
      : "bg-transparent text-ink hover:bg-black/5";

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium shadow-soft transition focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50 disabled:cursor-not-allowed",
        styles,
        className
      )}
      {...props}
    />
  );
}
