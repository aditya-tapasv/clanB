import React from "react";
import { cn } from "@/lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: string;
  glow?: boolean;
  children: React.ReactNode;
}

export function Card({
  accent,
  glow = true,
  className,
  children,
  style,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[20px] border border-zinc-800/80 bg-zinc-950 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:rounded-[28px] sm:p-6 md:p-10",
        className
      )}
      style={style}
      {...props}
    >
      {accent && glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-500"
          style={{
            backgroundImage: `radial-gradient(ellipse at 20% 0%, ${accent}22, transparent 45%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
