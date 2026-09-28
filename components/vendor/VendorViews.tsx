"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DashboardHeading, EmptyNote, LoadingRows, Panel, StatCard, StatusBadge } from "@/components/dashboard/ui";
import { useSession } from "@/components/auth/SessionProvider";
import { getVendorDashboard, listVendorBookings, listVendorSessions, setVendorCheckIn } from "@/lib/api/vendorPortal";
import type { ProviderDashboardData } from "@/lib/data/repo";
import type { Event, ProviderBookingRow } from "@/lib/data/types";
import { formatINR, formatSessionTime } from "@/lib/format";
import { cn } from "@/lib/cn";

function FillBar({ booked, capacity }: { booked: number; capacity: number }) {
  const pct = capacity ? Math.min(100, Math.round((booked / capacity) * 100)) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-signal" style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[11px] text-mist">
        {booked}/{capacity}
      </span>
    </div>
  );
}

function SessionList({ sessions, empty }: { sessions: Event[]; empty: string }) {
  if (sessions.length === 0) return <EmptyNote>{empty}</EmptyNote>;
  return (
    <ul className="divide-y divide-white/10">
      {sessions.map((s) => (
        <li key={s.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{s.title}</p>
            <p className="text-xs text-mist">{formatSessionTime(s.startsAt, s.endsAt)}</p>
          </div>
          <FillBar booked={s.booked} capacity={s.capacity} />
          <span className="w-20 text-sm text-white sm:text-right">{formatINR(s.price)}</span>
          <StatusBadge status={s.status} />
        </li>
      ))}
    </ul>
  );
}

export function VendorOverview() {
  const { user } = useSession();
  const [data, setData] = useState<ProviderDashboardData | null>(null);

  useEffect(() => {
    void getVendorDashboard().then(setData);
  }, []);

  return (
    <>
      <DashboardHeading
        eyebrow="Vendor workspace"
        title={`Hi${user ? `, ${user.name.split(" ")[0]}` : ""}`}
        description={data ? `Running as ${data.organization.name}` : "Your sessions, bookings and check-ins."}
        action={
          <Link
            href="/vendor/sessions"
            className="inline-flex items-center gap-2 self-start rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-white"
          >
            All sessions
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        }
      />

      {!data ? (
        <Panel>
          <LoadingRows rows={3} />
        </Panel>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Bookings" value={data.metrics.totalBookings} hint="paid" accent />
            <StatCard label="Fill rate" value={`${data.metrics.fillRatePercent}%`} hint="upcoming sessions" />
            <StatCard label="Revenue" value={formatINR(data.metrics.revenueTotalPaise)} />
            <StatCard label="Pending payouts" value={formatINR(data.metrics.pendingPayoutsPaise)} />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <Panel title="This week">
              <SessionList sessions={data.upcoming} empty="No sessions in the next 7 days." />
            </Panel>
            <Panel title="Check-ins today">
              <div className="p-5">
                <p className="font-display text-4xl font-semibold text-white">
                  {data.checkIns.done}
                  <span className="text-xl text-zinc-500"> / {data.checkIns.expected}</span>
                </p>
                <p className="mt-1 text-sm text-mist">players checked in</p>
                <Link href="/vendor/bookings" className="mt-5 inline-flex items-center gap-1.5 text-sm text-signal hover:underline">
                  Open check-in list <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </Panel>
          </div>
        </>
      )}
    </>
  );
}

export function VendorSessions() {
  const [sessions, setSessions] = useState<Event[] | null>(null);

  useEffect(() => {
    void listVendorSessions().then(setSessions);
  }, []);

  return (
    <>
      <DashboardHeading eyebrow="Sessions" title="Your sessions" description="Everything you run on Clan B, soonest first." />
      <Panel>{!sessions ? <LoadingRows /> : <SessionList sessions={sessions} empty="No sessions yet." />}</Panel>
    </>
  );
}

export function VendorBookings() {
  const [rows, setRows] = useState<ProviderBookingRow[] | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    void listVendorBookings().then(setRows);
  }, []);

  const toggle = async (row: ProviderBookingRow) => {
    setSavingId(row.booking.id);
    try {
      await setVendorCheckIn(row.booking.id, !row.checkedIn);
      setRows((prev) => prev?.map((r) => (r.booking.id === row.booking.id ? { ...r, checkedIn: !r.checkedIn } : r)) ?? null);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <DashboardHeading eyebrow="Bookings" title="Bookings & check-in" description="Tick players in at the door." />
      <Panel>
        {!rows ? (
          <LoadingRows />
        ) : rows.length === 0 ? (
          <EmptyNote>No bookings yet.</EmptyNote>
        ) : (
          <ul className="divide-y divide-white/10">
            {rows.map((r) => (
              <li key={r.booking.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {r.attendee.name} <span className="text-mist">× {r.booking.quantity}</span>
                  </p>
                  <p className="truncate text-xs text-mist">
                    {r.session.title} · {formatSessionTime(r.session.startsAt)}
                  </p>
                </div>
                <StatusBadge status={r.booking.state} />
                {r.booking.state === "confirmed" && (
                  <button
                    type="button"
                    aria-pressed={r.checkedIn}
                    disabled={savingId === r.booking.id}
                    onClick={() => void toggle(r)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-xs font-semibold transition disabled:opacity-60",
                      r.checkedIn ? "bg-signal text-ink" : "border border-white/15 bg-white/5 text-white hover:border-signal/50"
                    )}
                  >
                    {r.checkedIn ? "Checked in" : "Check in"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
