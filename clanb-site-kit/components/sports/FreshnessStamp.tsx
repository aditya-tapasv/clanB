"use client";

import { useSyncExternalStore } from "react";

const MINUTE = 60_000;

function subscribeMinute(callback: () => void): () => void {
  const id = window.setInterval(callback, 30_000);
  return () => window.clearInterval(id);
}

function getNowSnapshot(): number {
  return Math.floor(Date.now() / MINUTE) * MINUTE;
}

function getServerSnapshot(): null {
  return null;
}

function formatRelative(updatedAt: number, now: number): string {
  const minutes = Math.max(0, Math.round((now - updatedAt) / MINUTE));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

const IST_OFFSET_MIN = 330;

/** Manual HH:MM in IST — Intl output can differ between Node and browsers and break hydration. */
function formatAbsolute(updatedAt: number): string {
  const d = new Date(updatedAt + IST_OFFSET_MIN * MINUTE);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export interface FreshnessStampProps {
  updatedAt: string;
}

/**
 * "Updated {n} min ago". Server HTML shows a fixed IST time so hydration
 * matches; the client swaps in the relative value and keeps it ticking.
 */
export function FreshnessStamp({ updatedAt }: FreshnessStampProps) {
  const now = useSyncExternalStore(subscribeMinute, getNowSnapshot, getServerSnapshot);
  const ts = Date.parse(updatedAt);

  return (
    <time dateTime={updatedAt}>
      Updated {now === null ? `at ${formatAbsolute(ts)} IST` : formatRelative(ts, now)}
    </time>
  );
}
