"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Info, ArrowRight } from "lucide-react";
import { formatINR, formatSessionTime } from "@/lib/format";
import { useProviderData } from "./ProviderContext";
import { loadDashboard } from "./loaders";
import {
  ErrorNote, FillBar, LoadingBlock, PageHeader, Panel, StatCard, StatusPill, TableScroll, primaryButton, tableClass, tdClass, thClass,
} from "./ui";

export function TodayView() {
  const { data, loading, error, reload } = useProviderData(loadDashboard);

  return (
    <>
      <PageHeader
        title="Today"
        description={data ? `${data.organization.name} · what needs your attention` : "What needs your attention"}
        actions={
          <Link href="/provider/sessions/new" className={primaryButton}>
            New session
          </Link>
        }
      />
      {error && <ErrorNote message={error} onRetry={reload} />}
      {!data ? (
        loading && <LoadingBlock rows={6} />
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Paid bookings" value={data.metrics.totalBookings} />
            <StatCard label="Fill rate (upcoming)" value={`${data.metrics.fillRatePercent}%`} />
            <StatCard label="Booking revenue" value={formatINR(data.metrics.revenueTotalPaise)} hint="Base price less discounts" />
            <StatCard label="Pending payouts" value={formatINR(data.metrics.pendingPayoutsPaise)} />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Panel title="Action items" className="lg:col-span-2">
              {data.actionItems.length === 0 ? (
                <p className="text-[13px] text-mist">You&apos;re all caught up.</p>
              ) : (
                <ul className="divide-y divide-white/[0.06]">
                  {data.actionItems.map((a) => (
                    <li key={a.id}>
                      <Link
                        href={a.href}
                        className="flex items-center justify-between gap-3 py-2 text-[13px] transition-colors duration-150 hover:text-signal"
                      >
                        <span className="flex items-start gap-2">
                          {a.severity === "warning" ? (
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                          ) : (
                            <Info className="mt-0.5 h-4 w-4 shrink-0 text-glow" aria-hidden="true" />
                          )}
                          {a.label}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel
              title="Check-ins (next 24 h)"
              actions={
                <Link href="/provider/participants" className="text-[12px] text-signal hover:underline">
                  Open roster
                </Link>
              }
            >
              <p className="font-mono text-2xl text-white">
                {data.checkIns.done}
                <span className="text-mist">/{data.checkIns.expected}</span>
              </p>
              <p className="text-[12px] text-mist">players checked in</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-signal"
                  style={{ width: `${data.checkIns.expected ? Math.round((data.checkIns.done / data.checkIns.expected) * 100) : 0}%` }}
                />
              </div>
            </Panel>
          </div>

          <div>
            <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-mist">Upcoming · next 7 days</h2>
            {data.upcoming.length === 0 ? (
              <p className="rounded-lg border border-white/10 bg-panel p-4 text-[13px] text-mist">
                Nothing scheduled this week.{" "}
                <Link href="/provider/sessions/new" className="text-signal hover:underline">
                  Create a session
                </Link>
              </p>
            ) : (
              <TableScroll label="Upcoming sessions">
                <table className={tableClass}>
                  <thead>
                    <tr>
                      <th scope="col" className={thClass}>Session</th>
                      <th scope="col" className={thClass}>When</th>
                      <th scope="col" className={thClass}>Booked</th>
                      <th scope="col" className={thClass}>Waitlist</th>
                      <th scope="col" className={thClass}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.upcoming.map((e) => (
                      <tr key={e.id} className="transition-colors duration-150 hover:bg-white/[0.02]">
                        <td className={tdClass}>{e.title}</td>
                        <td className={`${tdClass} whitespace-nowrap text-mist`}>{formatSessionTime(e.startsAt)}</td>
                        <td className={tdClass}>
                          <FillBar booked={e.booked} capacity={e.capacity} />
                        </td>
                        <td className={`${tdClass} font-mono text-mist`}>{e.waitlist}</td>
                        <td className={tdClass}>
                          <StatusPill status={e.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableScroll>
            )}
          </div>

          <Panel title="Recent cancellations">
            {data.cancellations.length === 0 ? (
              <p className="text-[13px] text-mist">No cancellations.</p>
            ) : (
              <ul className="divide-y divide-white/[0.06] text-[13px]">
                {data.cancellations.map((r) => (
                  <li key={r.booking.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                    <span>
                      {r.attendee.name} · <span className="text-mist">{r.session.title}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-mist">×{r.booking.quantity}</span>
                      <StatusPill status={r.booking.state} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      )}
    </>
  );
}
