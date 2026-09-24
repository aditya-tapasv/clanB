"use client";

import React from "react";
import { formatINR } from "@/lib/format";
import { useProviderData } from "./ProviderContext";
import { loadInsights } from "./loaders";
import { ErrorNote, LoadingBlock, PageHeader, Panel, tableClass, tdClass, thClass } from "./ui";

/**
 * Basic single-series charts (one hue: brand lime). Every bar has a hover/focus tooltip,
 * values are in text ink, and each chart has a table view.
 */

function TableView({ caption, head, rows }: { caption: string; head: string[]; rows: (string | number)[][] }) {
  return (
    <details className="mt-3 text-[12px]">
      <summary className="cursor-pointer text-mist hover:text-white">View as table</summary>
      <div className="mt-2 overflow-x-auto">
        <table className={tableClass.replace("min-w-[640px]", "min-w-0")}>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {head.map((h) => (
                <th key={h} scope="col" className={thClass}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r[0])}>
                {r.map((c, i) => (
                  <td key={i} className={`${tdClass} ${i ? "font-mono" : ""}`}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/** Horizontal bar with a tooltip on hover/focus; the bar grows from the left baseline. */
function HBar({ label, value, max, display, tip }: { label: string; value: number; max: number; display: string; tip: string }) {
  const pct = max ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <li className="group relative grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3 py-1" tabIndex={0} aria-label={tip}>
      <span className="truncate text-[13px] text-mist">{label}</span>
      <span className="h-3 rounded-r bg-white/[0.04]">
        <span className="block h-full rounded-r-[4px] bg-signal transition-opacity duration-150 group-hover:opacity-80" style={{ width: `${pct}%` }} />
      </span>
      <span className="font-mono text-[12px] text-white">{display}</span>
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-7 left-40 z-10 hidden whitespace-nowrap rounded-md border border-white/15 bg-ink px-2 py-1 text-[12px] text-white shadow-lg group-hover:block group-focus:block"
      >
        {tip}
      </span>
    </li>
  );
}

export function InsightsView() {
  const { data, loading, error, reload } = useProviderData(loadInsights);

  if (error) return <ErrorNote message={error} onRetry={reload} />;

  const funnelSteps = data
    ? [
        { label: "Page views", value: data.funnel.views },
        { label: "Booking starts", value: data.funnel.bookingStarts },
        { label: "Holds", value: data.funnel.holds },
        { label: "Confirmed", value: data.funnel.confirmed },
      ]
    : [];
  const weeklyMax = data ? Math.max(1, ...data.weekly.map((w) => w.bookings)) : 1;

  return (
    <>
      <PageHeader title="Insights" description="How people find, book and fill your sessions." />
      {!data ? (
        loading && <LoadingBlock rows={8} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Views → bookings funnel">
            <ul>
              {funnelSteps.map((s, i) => {
                const prev = i ? funnelSteps[i - 1].value : 0;
                const conv = i && prev ? `${Math.round((s.value / prev) * 100)}% of previous step` : "Top of funnel";
                return (
                  <HBar key={s.label} label={s.label} value={s.value} max={funnelSteps[0].value} display={s.value.toLocaleString("en-IN")} tip={`${s.label}: ${s.value} · ${conv}`} />
                );
              })}
            </ul>
            <p className="mt-2 text-[12px] text-mist">
              Overall conversion:{" "}
              <span className="font-mono text-white">
                {data.funnel.views ? ((data.funnel.confirmed / data.funnel.views) * 100).toFixed(1) : "0.0"}%
              </span>{" "}
              of views become a confirmed booking.
            </p>
            <TableView
              caption="Booking funnel"
              head={["Step", "Count"]}
              rows={funnelSteps.map((s) => [s.label, s.value])}
            />
          </Panel>

          <Panel title="Fill rate · upcoming sessions">
            {data.fillRate.length === 0 ? (
              <p className="text-[13px] text-mist">No upcoming sessions.</p>
            ) : (
              <>
                <ul>
                  {data.fillRate.map((f) => {
                    const pct = f.capacity ? Math.round((f.booked / f.capacity) * 100) : 0;
                    return (
                      <HBar key={f.sessionId} label={f.title} value={pct} max={100} display={`${pct}%`} tip={`${f.title}: ${f.booked} of ${f.capacity} seats (${pct}%)`} />
                    );
                  })}
                </ul>
                <TableView
                  caption="Fill rate by session"
                  head={["Session", "Booked", "Capacity"]}
                  rows={data.fillRate.map((f) => [f.title, f.booked, f.capacity])}
                />
              </>
            )}
          </Panel>

          <Panel title="Paid bookings per week" className="lg:col-span-2">
            <div className="flex h-44 items-end gap-3 border-b border-white/15 px-1" role="list" aria-label="Paid bookings per week">
              {data.weekly.map((w) => (
                <div
                  key={w.label}
                  role="listitem"
                  tabIndex={0}
                  aria-label={`${w.label}: ${w.bookings} bookings, ${formatINR(w.revenue)}`}
                  className="group relative flex h-full flex-1 flex-col items-center justify-end"
                >
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute -top-1 z-10 hidden -translate-y-full whitespace-nowrap rounded-md border border-white/15 bg-ink px-2 py-1 text-[12px] text-white shadow-lg group-hover:block group-focus:block"
                  >
                    {w.bookings} bookings · {formatINR(w.revenue)}
                  </span>
                  <span
                    className="w-full max-w-10 rounded-t-[4px] bg-signal transition-opacity duration-150 group-hover:opacity-80"
                    style={{ height: `${Math.max(w.bookings ? 4 : 0, (w.bookings / weeklyMax) * 100)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex gap-3 px-1">
              {data.weekly.map((w) => (
                <span key={w.label} className="flex-1 text-center font-mono text-[11px] text-zinc-500">
                  {w.label}
                </span>
              ))}
            </div>
            <TableView
              caption="Paid bookings per week"
              head={["Week", "Bookings", "Revenue"]}
              rows={data.weekly.map((w) => [w.label, w.bookings, formatINR(w.revenue)])}
            />
          </Panel>
          <p className="font-mono text-[11px] text-zinc-500 lg:col-span-2">Demo data — views and funnel steps are simulated.</p>
        </div>
      )}
    </>
  );
}
