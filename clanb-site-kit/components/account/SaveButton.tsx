"use client";

import React from "react";
import { Bookmark, BookmarkCheck, Plus, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { toggleSaved, useSaved, type SavedItem } from "@/lib/saved";

/** Save (events/venues) or Follow (games/sports) toggle. */
export function SaveButton({ item, className }: { item: SavedItem; className?: string }) {
  const saved = useSaved();
  const active = saved.some((i) => i.kind === item.kind && i.slug === item.slug);
  const follow = item.kind === "game" || item.kind === "sport";
  const Icon = follow ? (active ? Check : Plus) : active ? BookmarkCheck : Bookmark;
  const label = follow ? (active ? "Following" : "Follow") : active ? "Saved" : "Save";

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => toggleSaved(item)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
        active
          ? "border-signal bg-signal/15 text-signal"
          : "border-white/15 bg-white/5 text-white hover:border-white/30",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
      <span className="sr-only"> {item.title}</span>
    </button>
  );
}
