import React from "react";
import { cn } from "@/lib/cn";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
  children: React.ReactNode;
}

export function Chip({ active = false, className, children, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition duration-200",
        active
          ? "border-signal/50 bg-signal/15 text-signal"
          : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
