"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  pillVariant?: boolean;
  /** Enables tab ids and aria-controls pointing at `${idPrefix}-panel`. */
  idPrefix?: string;
}

export function Tabs({
  tabs,
  activeId,
  onChange,
  className,
  pillVariant = false,
  idPrefix,
}: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex flex-wrap items-center gap-2",
        className
      )}
    >
      {tabs.map((tab) => {
        const isSelected = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={idPrefix ? `${idPrefix}-tab-${tab.id}` : undefined}
            aria-controls={idPrefix ? `${idPrefix}-panel` : undefined}
            aria-selected={isSelected}
            onClick={() => onChange(tab.id)}
            className={cn(
              "cursor-pointer text-sm font-medium transition duration-200 focus-visible:outline-2 focus-visible:outline-signal focus-visible:outline-offset-2",
              pillVariant
                ? cn(
                    "rounded-full border px-4 py-2",
                    isSelected
                      ? "border-signal bg-signal text-ink font-semibold"
                      : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                  )
                : cn(
                    "rounded-full border px-4 py-2",
                    isSelected
                      ? "border-signal bg-signal text-ink font-semibold"
                      : "border-white/15 text-white/70 hover:border-white/30 hover:text-white"
                  )
            )}
          >
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={cn(
                  "ml-1.5 rounded-full px-1.5 py-0.2 text-xs",
                  isSelected
                    ? "bg-ink/20 text-ink"
                    : "bg-white/10 text-white/60"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
