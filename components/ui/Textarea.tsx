import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full min-h-[96px] rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm outline-none shadow-soft focus:ring-2 focus:ring-black/15",
        className
      )}
      {...props}
    />
  );
}
