import React from "react";
import { cn } from "@/lib/cn";

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  accent?: string;
  children: React.ReactNode;
}

export function Pill({ accent, className, children, ...props }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-mist",
        className
      )}
      {...props}
    >
      {accent && (
        <span
          className="h-1.5 w-1.5 rounded-full shrink-0"
          style={{ backgroundColor: accent }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
