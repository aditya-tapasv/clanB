"use client";

import React, { useEffect, useState } from "react";
import { Check, ChevronDown, Loader2, X } from "lucide-react";
import { DashboardHeading, EmptyNote, LoadingRows, Panel, StatusBadge } from "@/components/dashboard/ui";
import {
  listContactQueries,
  listPartnerEnquiries,
  listVendorApplications,
  listVenueListings,
  setPartnerStatus,
  setQueryStatus,
  setVendorStatus,
  setVenueListingStatus,
} from "@/lib/api/admin";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

export type QueueKind = "vendors" | "partners" | "venue-listings" | "queries";

type Row = { id: string; reference: string; receivedAt: string; status: string } & Record<string, unknown>;

/** The queue renders every submission type generically, by field key. */
const toRows = (items: object[]) => items as Row[];

interface QueueConfig {
  eyebrow: string;
  title: string;
  description: string;
  load: () => Promise<Row[]>;
  primary: (r: Row) => string;
  secondary: (r: Row) => string;
  /** Status buttons offered for a row. */
  actions: { status: string; label: string; tone: "approve" | "reject" }[];
  setStatus: (id: string, status: string) => Promise<void>;
  /** Fields shown when a row is expanded, in order. */
  fields: [key: string, label: string][];
}

const REVIEW_ACTIONS: QueueConfig["actions"] = [
  { status: "approved", label: "Approve", tone: "approve" },
  { status: "rejected", label: "Reject", tone: "reject" },
];

const QUEUES: Record<QueueKind, QueueConfig> = {
  vendors: {
    eyebrow: "Vendors",
    title: "Vendor applications",
    description: "People who applied through Become a Vendor. Approving gives their account vendor access.",
    load: () => listVendorApplications().then(toRows),
    primary: (r) => String(r.name),
    secondary: (r) => `${r.city} · ${r.gameType}`,
    actions: REVIEW_ACTIONS,
    setStatus: (id, s) => setVendorStatus(id, s as "approved" | "rejected"),
    fields: [["email", "Email"], ["phone", "Phone"], ["city", "City"], ["gameType", "Type of games"], ["experience", "Experience"], ["venueAvailable", "Venue available?"], ["message", "Message"]],
  },
  partners: {
    eyebrow: "Partners",
    title: "Partner enquiries",
    description: "Businesses from Partner with Clan B. Each enquiry is also emailed to the partnerships inbox.",
    load: () => listPartnerEnquiries().then(toRows),
    primary: (r) => String(r.businessName),
    secondary: (r) => `${r.businessType} · ${r.location}`,
    actions: REVIEW_ACTIONS,
    setStatus: (id, s) => setPartnerStatus(id, s as "approved" | "rejected"),
    fields: [["contactPerson", "Contact person"], ["email", "Email"], ["phone", "Phone"], ["businessType", "Business type"], ["location", "Location"], ["services", "Services"], ["message", "Message"]],
  },
  "venue-listings": {
    eyebrow: "Venues",
    title: "Venue listings",
    description: "Spaces submitted through List Your Venue. Approved venues can go live in the directory.",
    load: () => listVenueListings().then(toRows),
    primary: (r) => String(r.venueName),
    secondary: (r) => `${r.location} · ${r.capacity} people`,
    actions: REVIEW_ACTIONS,
    setStatus: (id, s) => setVenueListingStatus(id, s as "approved" | "rejected"),
    fields: [["owner", "Owner"], ["email", "Email"], ["phone", "Phone"], ["location", "Location"], ["capacity", "Capacity"], ["facilities", "Facilities"]],
  },
  queries: {
    eyebrow: "Support",
    title: "Contact queries",
    description: "Questions sent from the Contact Us page.",
    load: () => listContactQueries().then(toRows),
    primary: (r) => String(r.name),
    secondary: (r) => String(r.query).slice(0, 80),
    actions: [
      { status: "resolved", label: "Mark resolved", tone: "approve" },
      { status: "open", label: "Reopen", tone: "reject" },
    ],
    setStatus: (id, s) => setQueryStatus(id, s as "open" | "resolved"),
    fields: [["query", "Query"]],
  },
};

const FILTERS = ["all", "pending", "open", "approved", "resolved", "rejected"] as const;

/** One review queue (list → expand → approve/reject). Config-driven for the four submission types. */
export function SubmissionQueue({ kind }: { kind: QueueKind }) {
  const config = QUEUES[kind];
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  useEffect(() => {
    let cancelled = false;
    config
      .load()
      .then((items) => !cancelled && setRows(items))
      .catch((err: unknown) => !cancelled && setError(err instanceof Error ? err.message : "Couldn't load submissions."));
    return () => {
      cancelled = true;
    };
  }, [config]);

  const changeStatus = async (id: string, status: string) => {
    setSavingId(id);
    try {
      await config.setStatus(id, status);
      setRows((prev) => prev?.map((r) => (r.id === id ? { ...r, status } : r)) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update the status.");
    } finally {
      setSavingId(null);
    }
  };

  const available = FILTERS.filter((f) => f === "all" || rows?.some((r) => r.status === f));
  const visible = rows?.filter((r) => filter === "all" || r.status === filter) ?? [];

  return (
    <>
      <DashboardHeading eyebrow={config.eyebrow} title={config.title} description={config.description} />

      {rows && rows.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {available.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs capitalize transition",
                filter === f ? "border-signal bg-signal/15 text-signal" : "border-white/15 bg-white/5 text-mist hover:text-white"
              )}
            >
              {f} {f === "all" ? `(${rows.length})` : `(${rows.filter((r) => r.status === f).length})`}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p role="alert" className="mb-4 text-sm text-rose-400">
          {error}
        </p>
      )}

      <Panel>
        {!rows ? (
          <LoadingRows />
        ) : visible.length === 0 ? (
          <EmptyNote>Nothing here yet.</EmptyNote>
        ) : (
          <ul className="divide-y divide-white/10">
            {visible.map((r) => {
              const open = expanded === r.id;
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setExpanded(open ? null : r.id)}
                    aria-expanded={open}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{config.primary(r)}</p>
                      <p className="truncate text-xs text-mist">{config.secondary(r)}</p>
                    </div>
                    <span className="hidden font-mono text-[11px] text-zinc-500 md:block">{r.reference}</span>
                    <span className="hidden text-xs text-zinc-500 sm:block">{formatDate(r.receivedAt)}</span>
                    <StatusBadge status={r.status} />
                    <ChevronDown className={cn("h-4 w-4 shrink-0 text-zinc-500 transition-transform", open && "rotate-180")} />
                  </button>

                  {open && (
                    <div className="border-t border-white/5 bg-white/[0.02] px-5 py-5">
                      <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                        {config.fields.map(([key, label]) => {
                          const value = r[key];
                          if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) return null;
                          return (
                            <div key={key} className={cn(key === "message" || key === "query" ? "sm:col-span-2" : "")}>
                              <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</dt>
                              <dd className="mt-0.5 whitespace-pre-line break-words text-sm text-white">
                                {Array.isArray(value) ? value.join(", ") : String(value)}
                              </dd>
                            </div>
                          );
                        })}
                      </dl>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {config.actions
                          .filter((a) => a.status !== r.status)
                          .map((a) => (
                            <button
                              key={a.status}
                              type="button"
                              disabled={savingId === r.id}
                              onClick={() => void changeStatus(r.id, a.status)}
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition disabled:opacity-60",
                                a.tone === "approve"
                                  ? "bg-signal text-ink hover:bg-white"
                                  : "border border-white/15 bg-white/5 text-white hover:border-rose-500/50 hover:text-rose-300"
                              )}
                            >
                              {savingId === r.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : a.tone === "approve" ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <X className="h-3.5 w-3.5" />
                              )}
                              {a.label}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </>
  );
}
