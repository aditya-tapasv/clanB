import React from "react";
import { cn } from "@/lib/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rect" | "circle" | "text";
}

export function Skeleton({
  variant = "rect",
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-white/10",
        variant === "circle" && "rounded-full",
        variant === "text" && "h-4 rounded-md",
        variant === "rect" && "rounded-xl",
        className
      )}
      {...props}
    />
  );
}
