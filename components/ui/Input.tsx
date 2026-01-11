import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm outline-none shadow-soft focus:ring-2 focus:ring-black/15",
        className
      )}
      {...props}
    />
  );
}
