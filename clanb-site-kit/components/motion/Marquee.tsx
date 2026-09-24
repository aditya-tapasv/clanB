import React from "react";
import { cn } from "@/lib/cn";

export interface MarqueeProps {
  children: React.ReactNode;
  slow?: boolean;
  fadeColor?: "ink" | "ink-soft";
  className?: string;
}

export function Marquee({
  children,
  slow = false,
  fadeColor = "ink",
  className,
}: MarqueeProps) {
  const fadeGradientLeft =
    fadeColor === "ink-soft"
      ? "from-ink-soft to-transparent"
      : "from-ink to-transparent";

  const fadeGradientRight =
    fadeColor === "ink-soft"
      ? "from-ink-soft to-transparent"
      : "from-ink to-transparent";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden py-4 select-none",
        className
      )}
    >
      {/* Left Edge Fade */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-28 bg-gradient-to-r",
          fadeGradientLeft
        )}
      />

      {/* Marquee Track with duplicated content for seamless loop */}
      <div
        className={cn(
          "flex w-max",
          slow ? "marquee-track-slow" : "marquee-track"
        )}
      >
        <div className="flex shrink-0 items-center gap-6 pr-6">
          {children}
        </div>
        <div className="flex shrink-0 items-center gap-6 pr-6" aria-hidden="true">
          {children}
        </div>
      </div>

      {/* Right Edge Fade */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-28 bg-gradient-to-l",
          fadeGradientRight
        )}
      />
    </div>
  );
}
