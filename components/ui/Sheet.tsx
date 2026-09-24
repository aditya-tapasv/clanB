"use client";

import React, { useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useFocusTrap } from "@/lib/useFocusTrap";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "left" | "right";
  className?: string;
}

export function Sheet({
  open,
  onClose,
  title,
  children,
  side = "right",
  className,
}: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useFocusTrap({ open, containerRef: sheetRef, onClose });

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      <div
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "fixed inset-y-0 z-10 flex max-w-full",
          side === "right" ? "right-0 pl-10" : "left-0 pr-10"
        )}
      >
        <div
          ref={sheetRef}
          tabIndex={-1}
          className={cn(
            "w-screen max-w-md border-white/10 bg-ink/95 p-6 shadow-2xl backdrop-blur-xl outline-none transition-transform duration-300",
            side === "right" ? "border-l" : "border-r",
            className
          )}
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            {title ? (
              <h2 className="font-display text-lg font-semibold text-white">
                {title}
              </h2>
            ) : (
              <span />
            )}
            <button
              onClick={onClose}
              aria-label="Close sheet"
              className="rounded-full p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-signal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 overflow-y-auto max-h-[calc(100vh-6rem)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
