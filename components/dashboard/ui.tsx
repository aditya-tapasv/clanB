import React from "react";
import { cn } from "@/lib/cn";

/** Page heading used on every dashboard page. */
export function DashboardHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">{eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-mist">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, hint, accent = false }: { label: string; value: React.ReactNode; hint?: string; accent?: boolean }) {
  return (
    <div className={cn("rounded-2xl border bg-panel/90 p-5", accent ? "border-signal/30" : "border-white/10")}>
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={cn("mt-2 font-display text-3xl font-semibold", accent ? "text-signal" : "text-white")}>{value}</p>
      {hint && <p className="mt-1 text-xs text-mist">{hint}</p>}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  open: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  approved: "border-signal/30 bg-signal/10 text-signal",
  resolved: "border-signal/30 bg-signal/10 text-signal",
  confirmed: "border-signal/30 bg-signal/10 text-signal",
  rejected: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  cancelled: "border-rose-500/30 bg-rose-500/10 text-rose-400",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        STATUS_STYLES[status] ?? "border-white/15 bg-white/5 text-mist"
      )}
    >
      {status}
    </span>
  );
}

export function Panel({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-white/10 bg-panel/90", className)}>
      {title && <h2 className="border-b border-white/10 px-5 py-4 font-display text-lg font-semibold text-white">{title}</h2>}
      {children}
    </section>
  );
}

export function LoadingRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-5" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-xl bg-white/5" />
      ))}
    </div>
  );
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className="px-5 py-10 text-center text-sm text-mist">{children}</p>;
}
