import React from "react";
import { LucideIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-panel px-6 py-12 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-signal">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-white">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-mist">{description}</p>
      {actionLabel && (
        <div className="mt-6">
          {actionHref ? (
            <Button href={actionHref} variant="signal-ghost">
              {actionLabel}
            </Button>
          ) : (
            <Button onClick={onAction} variant="signal-ghost">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
