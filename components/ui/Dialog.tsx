"use client";

import React, { useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useFocusTrap } from "@/lib/useFocusTrap";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Keep the title for screen readers only. */
  hideTitle?: boolean;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onClose,
  title,
  hideTitle = false,
  description,
  children,
  className,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap({ open, containerRef: dialogRef, onClose });

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          "relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-ink-soft/95 p-6 shadow-2xl backdrop-blur-xl outline-none",
          className
        )}
      >
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-signal"
        >
          <X className="h-5 w-5" />
        </button>

        {title && (
          <h2 className={cn("font-display text-xl font-semibold text-white", hideTitle && "sr-only")}>
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-1 text-sm text-mist">{description}</p>
        )}

        <div className={cn((title && !hideTitle) || description ? "mt-5" : "")}>
          {children}
        </div>
      </div>
    </div>
  );
}
