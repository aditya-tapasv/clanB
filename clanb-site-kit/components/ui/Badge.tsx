import React from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "default" | "signal" | "cyan" | "amber" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  ping?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "border-white/10 bg-white/5 text-mist",
  signal: "border-signal/30 bg-signal/10 text-signal",
  cyan: "border-glow/30 bg-glow/10 text-glow",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  outline: "border-white/20 bg-transparent text-white",
};

export function Badge({
  variant = "default",
  ping = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {ping && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
        </span>
      )}
      {children}
    </span>
  );
}
