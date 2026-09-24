import React from "react";
import { cn } from "@/lib/cn";

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: string;
  withDots?: boolean;
  children: React.ReactNode;
}

export function Panel({
  accent,
  withDots = true,
  className,
  children,
  style,
  ...props
}: PanelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-panel",
        className
      )}
      style={style}
      {...props}
    >
      {withDots && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.45) .55px, transparent .55px)",
            backgroundSize: "16px 16px",
          }}
        />
      )}
      {accent && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(ellipse at 20% 0%, ${accent}22, transparent 45%), radial-gradient(ellipse at 90% 80%, rgba(6,182,212,.1), transparent 40%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
