import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs shadow-soft", className)}>
      {children}
    </span>
  );
}
