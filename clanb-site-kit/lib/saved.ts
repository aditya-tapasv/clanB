"use client";

/** Saves (events, venues) and follows (games, sports) — USR-08. Mock: per browser. */
import { useSyncExternalStore } from "react";

export type SavedKind = "event" | "venue" | "game" | "sport";

export interface SavedItem {
  kind: SavedKind;
  slug: string;
  title: string;
}

const STORAGE_KEY = "clanb.mock.saved.v1";
const EMPTY: SavedItem[] = [];
const listeners = new Set<() => void>();
let cached: SavedItem[] | undefined;

function read(): SavedItem[] {
  if (cached) return cached;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    // Ignore anything that isn't the expected shape (e.g. data from an older build).
    cached = Array.isArray(parsed)
      ? parsed.filter((i): i is SavedItem => !!i && typeof i.slug === "string" && typeof i.title === "string" && typeof i.kind === "string")
      : EMPTY;
  } catch {
    cached = EMPTY;
  }
  return cached;
}

function write(items: SavedItem[]) {
  cached = items;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage blocked: keep in memory for this page view.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSaved(): SavedItem[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggleSaved(item: SavedItem) {
  const items = read();
  const exists = items.some((i) => i.kind === item.kind && i.slug === item.slug);
  write(exists ? items.filter((i) => !(i.kind === item.kind && i.slug === item.slug)) : [...items, item]);
}

export function hrefFor(item: Pick<SavedItem, "kind" | "slug">): string {
  const base = { event: "events", venue: "venues", game: "games", sport: "sports" }[item.kind];
  return `/${base}/${item.slug}`;
}
