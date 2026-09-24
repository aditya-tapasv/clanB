"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatSessionTime } from "@/lib/format";
import { repo } from "@/lib/data/repo";
import { useProviderData } from "./ProviderContext";
import { loadBookings } from "./loaders";
import { ErrorNote, LoadingBlock, PageHeader, Panel, inputClass } from "./ui";

/** Roster + check-in toggles per session (ORG-07). */
export function ParticipantsView({ initialSessionId }: { initialSessionId?: string }) {
  const { data, loading, error, reload } = useProviderData(loadBookings);
  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId);
  const [query, setQuery] = useState("");
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [toggleError, setToggleError] = useState<string | null>(null);

  // Sessions that have confirmed players, soonest first.
  const sessions = useMemo(() => {
    const map = new Map<string, NonNullable<typeof data>[number]["session"]>();
    for (const r of data ?? []) if (r.booking.state === "confirmed") map.set(r.session.id, r.session);
    return [...map.values()].sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  }, [data]);

  const activeId = sessionId && sessions.some((s) => s.id === sessionId) ? sessionId : sessions[0]?.id;
  const roster = (data ?? []).filter(
    (r) =>
      r.session.id === activeId &&
      r.booking.state === "confirmed" &&
      (!query.trim() || r.attendee.name.toLowerCase().includes(query.trim().toLowerCase()) || (r.booking.confirmationCode ?? "").toLowerCase().includes(query.trim().toLowerCase()))
  );
  const isIn = (id: string, fallback: boolean) => overrides[id] ?? fallback;
  const expected = roster.reduce((n, r) => n + r.booking.quantity, 0);
  const done = roster.filter((r) => isIn(r.booking.id, r.checkedIn)).reduce((n, r) => n + r.booking.quantity, 0);

  const toggle = async (bookingId: string, next: boolean) => {
    setOverrides((o) => ({ ...o, [bookingId]: next }));
    setPending((p) => new Set(p).add(bookingId));
    setToggleError(null);
    try {
      await repo.setCheckIn(bookingId, next);
    } catch {
      setOverrides((o) => ({ ...o, [bookingId]: !next }));
      setToggleError("Couldn't update check-in. Try again.");
    } finally {
      setPending((p) => {
        const n = new Set(p);
        n.delete(bookingId);
        return n;
      });
    }
  };

  return (
    <>
      <PageHeader title="Participants & check-in" description="Scan QR codes at the door, or tick players in here." />
      {error && <ErrorNote message={error} onRetry={reload} />}
      {toggleError && <ErrorNote message={toggleError} />}
      {!data ? (
        loading && <LoadingBlock rows={8} />
      ) : sessions.length === 0 ? (
        <p className="rounded-lg border border-white/10 bg-panel p-4 text-[13px] text-mist">No sessions with confirmed players yet.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row">
            <label htmlFor="roster-session" className="sr-only">
              Session
            </label>
            <select id="roster-session" value={activeId} onChange={(e) => setSessionId(e.target.value)} className={cn(inputClass, "md:max-w-md")}>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} — {formatSessionTime(s.startsAt)}
                </option>
              ))}
            </select>
            <input
              type="search"
              aria-label="Search roster"
              placeholder="Search name or code"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={cn(inputClass, "md:w-56")}
            />
          </div>

          <Panel
            title="Roster"
            actions={
              <span className="font-mono text-[12px] text-mist" aria-live="polite">
                {done}/{expected} checked in
              </span>
            }
          >
            {roster.length === 0 ? (
              <p className="text-[13px] text-mist">No players match.</p>
            ) : (
              <ul className="divide-y divide-white/[0.06]">
                {roster.map((r) => {
                  const on = isIn(r.booking.id, r.checkedIn);
                  return (
                    <li key={r.booking.id} className="flex items-center justify-between gap-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-white">
                          {r.attendee.name}
                          {r.booking.quantity > 1 && <span className="text-mist"> +{r.booking.quantity - 1}</span>}
                        </p>
                        <p className="font-mono text-[11px] text-zinc-500">{r.booking.confirmationCode}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={on}
                        aria-label={`Checked in: ${r.attendee.name}`}
                        disabled={pending.has(r.booking.id)}
                        onClick={() => toggle(r.booking.id, !on)}
                        className={cn(
                          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 disabled:opacity-60",
                          on ? "bg-signal" : "bg-white/15"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-150",
                            on ? "translate-x-[22px]" : "translate-x-0.5"
                          )}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>
      )}
    </>
  );
}
