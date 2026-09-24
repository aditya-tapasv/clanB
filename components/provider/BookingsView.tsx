"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatINR, formatSessionTime } from "@/lib/format";
import type { BookingState } from "@/lib/data/types";
import { useProviderData } from "./ProviderContext";
import { loadBookings } from "./loaders";
import { ErrorNote, LoadingBlock, PageHeader, StatusPill, TableScroll, inputClass, tableClass, tdClass, thClass } from "./ui";

const STATES: ("all" | BookingState)[] = ["all", "confirmed", "completed", "cancelled", "refunded", "no-show"];

export function BookingsView() {
  const { data, loading, error, reload } = useProviderData(loadBookings);
  const [state, setState] = useState<"all" | BookingState>("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter(
      (r) =>
        (state === "all" || r.booking.state === state) &&
        (!q ||
          r.attendee.name.toLowerCase().includes(q) ||
          r.session.title.toLowerCase().includes(q) ||
          (r.booking.confirmationCode ?? "").toLowerCase().includes(q))
    );
  }, [data, state, query]);

  return (
    <>
      <PageHeader title="Bookings" description="Every booking across your sessions. Payment states come from Clan B." />
      {error && <ErrorNote message={error} onRetry={reload} />}
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter by state" className="flex flex-wrap gap-1">
          {STATES.map((s) => {
            const count = (data ?? []).filter((r) => s === "all" || r.booking.state === s).length;
            return (
              <button
                key={s}
                type="button"
                aria-pressed={state === s}
                onClick={() => setState(s)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[13px] capitalize transition-colors duration-150",
                  state === s ? "bg-signal/15 text-signal" : "text-mist hover:bg-white/5 hover:text-white"
                )}
              >
                {s.replace("-", " ")} <span className="font-mono text-[11px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
        <input
          type="search"
          aria-label="Search bookings"
          placeholder="Search name, session or code"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(inputClass, "md:w-64")}
        />
      </div>

      {!data ? (
        loading && <LoadingBlock rows={10} />
      ) : rows.length === 0 ? (
        <p className="rounded-lg border border-white/10 bg-panel p-4 text-[13px] text-mist">No bookings match.</p>
      ) : (
        <TableScroll label="Bookings">
          <table className={tableClass}>
            <thead>
              <tr>
                <th scope="col" className={thClass}>Code</th>
                <th scope="col" className={thClass}>Player</th>
                <th scope="col" className={thClass}>Session</th>
                <th scope="col" className={thClass}>When</th>
                <th scope="col" className={`${thClass} text-right`}>Qty</th>
                <th scope="col" className={`${thClass} text-right`}>Total</th>
                <th scope="col" className={thClass}>Booking</th>
                <th scope="col" className={thClass}>Payment</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.booking.id} className="transition-colors duration-150 hover:bg-white/[0.02]">
                  <td className={`${tdClass} font-mono text-[12px] text-mist`}>{r.booking.confirmationCode}</td>
                  <td className={tdClass}>
                    <div>{r.attendee.name}</div>
                    <div className="text-[11px] text-zinc-500">{r.attendee.email}</div>
                  </td>
                  <td className={tdClass}>{r.session.title}</td>
                  <td className={`${tdClass} whitespace-nowrap text-mist`}>{formatSessionTime(r.session.startsAt)}</td>
                  <td className={`${tdClass} text-right font-mono`}>{r.booking.quantity}</td>
                  <td className={`${tdClass} text-right font-mono`}>{r.payment ? formatINR(r.payment.total) : "—"}</td>
                  <td className={tdClass}>
                    <StatusPill status={r.booking.state} />
                  </td>
                  <td className={tdClass}>{r.payment && <StatusPill status={r.payment.state} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroll>
      )}
    </>
  );
}
