"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatINR, formatSessionTime } from "@/lib/format";
import { repo } from "@/lib/data/repo";
import type { Event, EventStatus } from "@/lib/data/types";
import { Dialog } from "@/components/ui/Dialog";
import { useProviderData } from "./ProviderContext";
import { loadSessions } from "./loaders";
import {
  ErrorNote, FillBar, LoadingBlock, PageHeader, Panel, StatusPill, TableScroll, dangerButton, ghostButton, primaryButton, tableClass, tdClass, thClass,
} from "./ui";

type Filter = "upcoming" | "drafts" | "past" | "cancelled" | "all";

const FILTERS: { id: Filter; label: string; match: (e: Event, now: number) => boolean }[] = [
  { id: "upcoming", label: "Upcoming", match: (e, now) => Date.parse(e.endsAt) > now && !["draft", "pending-review", "cancelled"].includes(e.status) },
  { id: "drafts", label: "Drafts & review", match: (e) => e.status === "draft" || e.status === "pending-review" },
  { id: "past", label: "Past", match: (e, now) => Date.parse(e.endsAt) <= now && e.status !== "cancelled" },
  { id: "cancelled", label: "Cancelled", match: (e) => e.status === "cancelled" },
  { id: "all", label: "All", match: () => true },
];

const SERVICE_LABEL: Record<string, string> = {
  "open-session": "Open session",
  "private-session": "Private session",
  event: "Event",
  tournament: "Tournament",
  "league-season": "League season",
  "venue-resource": "Venue resource",
  "coaching-guided-play": "Coaching",
  "custom-event": "Custom event",
  "clanb-official-service": "Clan B official",
};

export function SessionsView() {
  const { data, loading, error, reload } = useProviderData(loadSessions);
  const [filter, setFilter] = useState<Filter>("upcoming");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<Event | null>(null);
  // Snapshot "now" once per data load so filtering stays pure during render.
  const [now] = useState(() => Date.now());

  const setStatus = async (e: Event, status: EventStatus) => {
    setBusyId(e.id);
    setActionError(null);
    try {
      await repo.updateSessionStatus(e.id, status);
      reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Couldn't update the session.");
    } finally {
      setBusyId(null);
      setConfirmCancel(null);
    }
  };

  const active = FILTERS.find((f) => f.id === filter) ?? FILTERS[0];
  const rows = data?.sessions.filter((e) => active.match(e, now)) ?? [];

  return (
    <>
      <PageHeader
        title="Services & sessions"
        description="Everything you run, and each scheduled occurrence."
        actions={
          <Link href="/provider/sessions/new" className={primaryButton}>
            New session
          </Link>
        }
      />
      {error && <ErrorNote message={error} onRetry={reload} />}
      {actionError && <ErrorNote message={actionError} />}
      {!data ? (
        loading && <LoadingBlock rows={8} />
      ) : (
        <div className="space-y-5">
          <Panel title={`Services (${data.services.length})`}>
            {data.services.length === 0 ? (
              <p className="text-[13px] text-mist">No services yet. Creating a session sets one up for you.</p>
            ) : (
              <ul className="grid gap-2 md:grid-cols-2">
                {data.services.map((s) => (
                  <li key={s.id} className="rounded-md border border-white/10 px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-white">{s.title}</span>
                      <span className="font-mono text-[12px] text-mist">{formatINR(s.basePrice)}</span>
                    </div>
                    <p className="text-[12px] text-zinc-500">
                      {SERVICE_LABEL[s.type]} · {s.bookingMode.replace("-", " ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <div>
            <div role="group" aria-label="Filter sessions" className="mb-2 flex flex-wrap gap-1">
              {FILTERS.map((f) => {
                const count = data.sessions.filter((e) => f.match(e, now)).length;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={filter === f.id}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-[13px] transition-colors duration-150",
                      filter === f.id ? "bg-signal/15 text-signal" : "text-mist hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {f.label} <span className="font-mono text-[11px] opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>

            {rows.length === 0 ? (
              <p className="rounded-lg border border-white/10 bg-panel p-4 text-[13px] text-mist">No sessions in this view.</p>
            ) : (
              <TableScroll label="Sessions">
                <table className={tableClass}>
                  <thead>
                    <tr>
                      <th scope="col" className={thClass}>Session</th>
                      <th scope="col" className={thClass}>When</th>
                      <th scope="col" className={thClass}>Price</th>
                      <th scope="col" className={thClass}>Booked</th>
                      <th scope="col" className={thClass}>Status</th>
                      <th scope="col" className={thClass}>
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((e) => {
                      const created = e.id.startsWith("evt-new-");
                      const busy = busyId === e.id;
                      return (
                        <tr key={e.id} className="transition-colors duration-150 hover:bg-white/[0.02]">
                          <td className={tdClass}>
                            <span className="flex items-center gap-1.5">
                              {e.title}
                              {!created && (
                                <Link href={`/events/${e.slug}`} aria-label={`View public page for ${e.title}`} className="text-zinc-500 hover:text-signal">
                                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                                </Link>
                              )}
                            </span>
                          </td>
                          <td className={`${tdClass} whitespace-nowrap text-mist`}>{formatSessionTime(e.startsAt)}</td>
                          <td className={`${tdClass} font-mono`}>{formatINR(e.price)}</td>
                          <td className={tdClass}>
                            <FillBar booked={e.booked} capacity={e.capacity} />
                          </td>
                          <td className={tdClass}>
                            <StatusPill status={e.status} />
                          </td>
                          <td className={`${tdClass} whitespace-nowrap text-right`}>
                            {e.status === "draft" && (
                              <button type="button" disabled={busy} onClick={() => setStatus(e, "open")} className={ghostButton}>
                                Publish
                              </button>
                            )}
                            {["open", "published", "full", "waitlist", "draft", "pending-review"].includes(e.status) && (
                              <button type="button" disabled={busy} onClick={() => setConfirmCancel(e)} className={`${dangerButton} ml-1.5`}>
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </TableScroll>
            )}
          </div>
        </div>
      )}

      <Dialog open={confirmCancel !== null} onClose={() => setConfirmCancel(null)} title="Cancel this session?" description={confirmCancel?.title}>
        {confirmCancel && (
          <div className="space-y-4 text-[13px]">
            <p className="text-mist">
              {confirmCancel.booked > 0
                ? `${confirmCancel.booked} booked players will be notified and refunded in full, including fees.`
                : "No one has booked yet."}
            </p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmCancel(null)} className={ghostButton}>
                Keep it
              </button>
              <button type="button" disabled={busyId !== null} onClick={() => setStatus(confirmCancel, "cancelled")} className={dangerButton}>
                Cancel session
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
