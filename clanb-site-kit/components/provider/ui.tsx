import React from "react";
import { cn } from "@/lib/cn";
import type { BookingState, EventStatus } from "@/lib/data/types";

/** Dense workspace primitives: 14px DM Sans, compact spacing, 150 ms transitions only. */

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        {description && <p className="mt-0.5 text-[13px] text-mist">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, actions, children, className }: { title?: string; actions?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-lg border border-white/10 bg-panel", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5">
          {title && <h2 className="text-[13px] font-semibold uppercase tracking-wide text-mist">{title}</h2>}
          {actions}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-panel px-4 py-3">
      <p className="text-[12px] text-mist">{label}</p>
      <p className="mt-1 font-mono text-xl text-white">{value}</p>
      {hint && <p className="mt-0.5 text-[11px] text-zinc-500">{hint}</p>}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  open: "bg-signal/15 text-signal",
  published: "bg-signal/15 text-signal",
  live: "bg-glow/15 text-glow",
  full: "bg-amber-500/15 text-amber-400",
  waitlist: "bg-amber-500/15 text-amber-400",
  draft: "bg-white/10 text-mist",
  "pending-review": "bg-violet-500/15 text-violet-300",
  completed: "bg-white/10 text-zinc-300",
  archived: "bg-white/5 text-zinc-500",
  cancelled: "bg-rose-500/15 text-rose-300",
  confirmed: "bg-signal/15 text-signal",
  held: "bg-amber-500/15 text-amber-400",
  refunded: "bg-rose-500/15 text-rose-300",
  "no-show": "bg-white/10 text-zinc-400",
  pending: "bg-violet-500/15 text-violet-300",
  scheduled: "bg-white/10 text-mist",
  processing: "bg-amber-500/15 text-amber-400",
  paid: "bg-signal/15 text-signal",
};

export function StatusPill({ status }: { status: EventStatus | BookingState | string }) {
  return (
    <span className={cn("inline-flex rounded px-1.5 py-0.5 text-[11px] font-medium capitalize", STATUS_STYLES[status] ?? "bg-white/10 text-mist")}>
      {status.replace("-", " ")}
    </span>
  );
}

export function FillBar({ booked, capacity }: { booked: number; capacity: number }) {
  const pct = capacity ? Math.min(100, Math.round((booked / capacity) * 100)) : 0;
  return (
    <div className="flex items-center gap-2" aria-label={`${booked} of ${capacity} booked`}>
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
        <div className={cn("h-full rounded-full", pct >= 100 ? "bg-amber-400" : "bg-signal")} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[12px] text-mist">
        {booked}/{capacity}
      </span>
    </div>
  );
}

export const tableClass = "w-full min-w-[640px] border-collapse text-left text-[13px]";
export const thClass = "border-b border-white/10 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-zinc-500";
export const tdClass = "border-b border-white/[0.06] px-3 py-2 align-middle";

export function TableScroll({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10 bg-panel" role="region" aria-label={label} tabIndex={0}>
      {children}
    </div>
  );
}

export function LoadingBlock({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-9 animate-pulse rounded bg-white/[0.04]" />
      ))}
    </div>
  );
}

export function ErrorNote({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <p role="alert" className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[13px] text-rose-300">
      {message}{" "}
      {onRetry && (
        <button type="button" onClick={onRetry} className="underline">
          Retry
        </button>
      )}
    </p>
  );
}

export const inputClass =
  "w-full rounded-md border border-white/15 bg-ink-soft px-2.5 py-1.5 text-[13px] text-white placeholder:text-zinc-500 transition-colors duration-150 focus:border-signal focus:outline-none";
export const buttonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 disabled:opacity-50";
export const primaryButton = cn(buttonClass, "bg-signal text-ink hover:bg-white");
export const ghostButton = cn(buttonClass, "border border-white/15 text-white hover:bg-white/5");
export const dangerButton = cn(buttonClass, "border border-rose-500/40 text-rose-300 hover:bg-rose-500/10");
