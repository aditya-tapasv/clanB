"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatSessionTime } from "@/lib/format";
import { istDate, istToIso } from "@/lib/data/slots";
import { repo } from "@/lib/data/repo";
import type { BookingMode, Event, ServiceType, SessionDraft } from "@/lib/data/types";
import { useProvider, useProviderData } from "./ProviderContext";
import { loadCreateOptions } from "./loaders";
import { ErrorNote, LoadingBlock, PageHeader, Panel, ghostButton, inputClass, primaryButton } from "./ui";

const SERVICE_TYPES: { id: ServiceType; label: string }[] = [
  { id: "open-session", label: "Open session (seats)" },
  { id: "private-session", label: "Private session (whole table/court)" },
  { id: "event", label: "Event (tickets)" },
  { id: "tournament", label: "Tournament (entries)" },
  { id: "league-season", label: "League season" },
  { id: "coaching-guided-play", label: "Coaching / guided play" },
];

const BOOKING_MODES: { id: BookingMode; label: string }[] = [
  { id: "instant", label: "Instant confirmation" },
  { id: "provider-approval", label: "I approve each booking" },
  { id: "request-quote", label: "Request a quote" },
];

const POLICIES = [
  { id: "pol-flexible", label: "Flexible — full refund up to 24 h before" },
  { id: "pol-moderate", label: "Moderate — 50% refund up to 48 h before" },
  { id: "pol-strict", label: "Strict — no refund within 72 h" },
  { id: "pol-venue", label: "Venue slot — full refund up to 2 h before" },
];

const EMPTY_DRAFT: SessionDraft = {
  title: "",
  summary: "",
  activityId: "",
  serviceType: "open-session",
  format: "",
  pricePaise: 35000,
  capacity: 12,
  durationMin: 120,
  rules: "",
  venueId: "",
  bookingMode: "instant",
  date: "",
  time: "19:00",
  repeatWeekly: false,
  policyId: "pol-flexible",
};

type FieldKey = keyof SessionDraft;

function Label({ htmlFor, children, ai }: { htmlFor: string; children: React.ReactNode; ai?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 flex items-center gap-1.5 text-[12px] font-medium text-mist">
      {children}
      {ai && (
        <span className="inline-flex items-center gap-0.5 rounded bg-violet-500/15 px-1 text-[10px] text-violet-300">
          <Sparkles className="h-2.5 w-2.5" aria-hidden="true" /> AI
        </span>
      )}
    </label>
  );
}

export function CreateSessionView() {
  const { orgId, org } = useProvider();
  const { data, loading, error } = useProviderData(loadCreateOptions);
  const [draft, setDraft] = useState<SessionDraft>(EMPTY_DRAFT);
  const [aiFields, setAiFields] = useState<Set<FieldKey>>(new Set());
  const [brief, setBrief] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [created, setCreated] = useState<Event[] | null>(null);

  const update = <K extends FieldKey>(key: K, value: SessionDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setAiFields((s) => {
      if (!s.has(key)) return s;
      const next = new Set(s);
      next.delete(key);
      return next;
    });
  };

  const draftWithAI = async () => {
    if (brief.trim().length < 8) {
      setFormError("Describe the session in a sentence so the draft has something to work with.");
      return;
    }
    setDrafting(true);
    setFormError(null);
    try {
      const suggestion = await repo.draftSessionWithAI(orgId, brief);
      setDraft(suggestion);
      setAiFields(new Set(Object.keys(suggestion) as FieldKey[]));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't draft a session.");
    } finally {
      setDrafting(false);
    }
  };

  const save = async (publish: boolean) => {
    setSaving(publish ? "publish" : "draft");
    setFormError(null);
    try {
      if (!draft.activityId || !draft.venueId) throw new Error("Choose an activity and a location.");
      setCreated(await repo.createSession(orgId, draft, publish));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't save the session.");
    } finally {
      setSaving(null);
    }
  };

  if (created) {
    return (
      <>
        <PageHeader title="Session created" />
        <Panel>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-signal" aria-hidden="true" />
            <div className="space-y-2 text-[13px]">
              <p className="text-white">
                {created.length > 1 ? `${created.length} weekly sessions` : "Your session"} saved as{" "}
                <strong className="capitalize">{created[0].status.replace("-", " ")}</strong>.
              </p>
              <ul className="text-mist">
                {created.map((e) => (
                  <li key={e.id}>{formatSessionTime(e.startsAt, e.endsAt)}</li>
                ))}
              </ul>
              {created[0].status === "pending-review" && (
                <p className="text-amber-300">Your organization isn&apos;t verified yet, so Clan B reviews it before it goes live.</p>
              )}
              <div className="flex gap-2 pt-2">
                <Link href="/provider/sessions" className={primaryButton}>
                  Go to sessions
                </Link>
                <button
                  type="button"
                  className={ghostButton}
                  onClick={() => {
                    setCreated(null);
                    setDraft(EMPTY_DRAFT);
                    setAiFields(new Set());
                    setBrief("");
                  }}
                >
                  Create another
                </button>
              </div>
            </div>
          </div>
        </Panel>
      </>
    );
  }

  const ai = (k: FieldKey) => aiFields.has(k);
  const fieldCls = (k: FieldKey) => cn(inputClass, ai(k) && "border-violet-400/60");
  const minDate = istDate(0);

  return (
    <>
      <PageHeader title="New session" description={`Create a session or event for ${org?.name ?? "your organization"}.`} />
      {error && <ErrorNote message={error} />}
      {!data ? (
        loading && <LoadingBlock rows={8} />
      ) : (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            save(true);
          }}
          className="space-y-4"
        >
          <Panel title="Draft with AI">
            <div className="space-y-2">
              <label htmlFor="brief" className="block text-[12px] text-mist">
                Describe it in a sentence — e.g. “Beginner Catan night for 12 players every Friday 7pm, ₹400”.
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input id="brief" value={brief} onChange={(e) => setBrief(e.target.value)} className={inputClass} />
                <button type="button" onClick={draftWithAI} disabled={drafting} className={cn(ghostButton, "shrink-0 border-violet-400/40 text-violet-200")}>
                  {drafting ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}
                  Draft with AI
                </button>
              </div>
              {aiFields.size > 0 && (
                <p role="status" className="rounded-md border border-violet-400/30 bg-violet-500/10 px-3 py-2 text-[12px] text-violet-200">
                  Suggested draft filled in. Fields marked <strong>AI</strong> are suggestions — review every one before
                  publishing. Nothing goes live until you publish.
                </p>
              )}
            </div>
          </Panel>

          <Panel title="Basics">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="title" ai={ai("title")}>Title</Label>
                <input id="title" value={draft.title} onChange={(e) => update("title", e.target.value)} className={fieldCls("title")} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="summary" ai={ai("summary")}>Summary</Label>
                <textarea id="summary" rows={2} value={draft.summary} onChange={(e) => update("summary", e.target.value)} className={fieldCls("summary")} />
              </div>
              <div>
                <Label htmlFor="activity" ai={ai("activityId")}>Activity</Label>
                <select
                  id="activity"
                  value={draft.activityId}
                  onChange={(e) => {
                    const a = data.activities.find((x) => x.id === e.target.value);
                    update("activityId", e.target.value);
                    if (a && !draft.format) update("format", a.format);
                  }}
                  className={fieldCls("activityId")}
                >
                  <option value="" disabled>
                    Choose…
                  </option>
                  {data.activities.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.kind === "sport" ? "sport" : "game"})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="serviceType" ai={ai("serviceType")}>Type</Label>
                <select id="serviceType" value={draft.serviceType} onChange={(e) => update("serviceType", e.target.value as ServiceType)} className={fieldCls("serviceType")}>
                  {SERVICE_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Panel>

          <Panel title="Format, pricing & capacity">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label htmlFor="format" ai={ai("format")}>Format</Label>
                <input id="format" value={draft.format} onChange={(e) => update("format", e.target.value)} className={fieldCls("format")} />
              </div>
              <div>
                <Label htmlFor="price" ai={ai("pricePaise")}>Price per seat (₹)</Label>
                <input
                  id="price"
                  type="number"
                  min={0}
                  step={10}
                  value={draft.pricePaise / 100}
                  onChange={(e) => update("pricePaise", Math.max(0, Math.round(Number(e.target.value) * 100)))}
                  className={fieldCls("pricePaise")}
                />
              </div>
              <div>
                <Label htmlFor="capacity" ai={ai("capacity")}>Capacity</Label>
                <input id="capacity" type="number" min={1} max={200} value={draft.capacity} onChange={(e) => update("capacity", Number(e.target.value))} className={fieldCls("capacity")} />
              </div>
              <div>
                <Label htmlFor="duration" ai={ai("durationMin")}>Duration (min)</Label>
                <input id="duration" type="number" min={15} step={15} value={draft.durationMin} onChange={(e) => update("durationMin", Number(e.target.value))} className={fieldCls("durationMin")} />
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <Label htmlFor="rules" ai={ai("rules")}>Rules & what to bring</Label>
                <textarea id="rules" rows={2} value={draft.rules} onChange={(e) => update("rules", e.target.value)} className={fieldCls("rules")} />
              </div>
            </div>
          </Panel>

          <Panel title="Schedule & location">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <Label htmlFor="venue" ai={ai("venueId")}>Location</Label>
                <select
                  id="venue"
                  value={draft.venueId}
                  onChange={(e) => {
                    update("venueId", e.target.value);
                    update("resourceId", undefined);
                  }}
                  className={fieldCls("venueId")}
                >
                  <option value="" disabled>
                    Choose a venue…
                  </option>
                  {data.venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} · {v.address.neighbourhood}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="resource">Table / court (optional)</Label>
                <select id="resource" value={draft.resourceId ?? ""} onChange={(e) => update("resourceId", e.target.value || undefined)} className={inputClass}>
                  <option value="">Any</option>
                  {data.inventory.resources
                    .filter((r) => r.venueId === draft.venueId)
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <Label htmlFor="date" ai={ai("date")}>Date</Label>
                <input id="date" type="date" min={minDate} value={draft.date} onChange={(e) => update("date", e.target.value)} className={fieldCls("date")} />
              </div>
              <div>
                <Label htmlFor="time" ai={ai("time")}>Start (IST)</Label>
                <input id="time" type="time" step={900} value={draft.time} onChange={(e) => update("time", e.target.value)} className={fieldCls("time")} />
              </div>
              <div className="flex items-end sm:col-span-2">
                <label className="flex items-center gap-2 pb-1.5 text-[13px] text-white">
                  <input type="checkbox" checked={draft.repeatWeekly} onChange={(e) => update("repeatWeekly", e.target.checked)} className="accent-[#5CF111]" />
                  Repeat weekly for 4 weeks
                  {ai("repeatWeekly") && <span className="rounded bg-violet-500/15 px-1 text-[10px] text-violet-300">AI</span>}
                </label>
              </div>
              {draft.date && draft.time && (
                <p className="text-[12px] text-zinc-500 sm:col-span-2 lg:col-span-4">
                  First session: {formatSessionTime(istToIso(draft.date, draft.time), new Date(Date.parse(istToIso(draft.date, draft.time)) + draft.durationMin * 60_000).toISOString())}
                </p>
              )}
            </div>
          </Panel>

          <Panel title="Booking & policy">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="mode" ai={ai("bookingMode")}>Booking mode</Label>
                <select id="mode" value={draft.bookingMode} onChange={(e) => update("bookingMode", e.target.value as BookingMode)} className={fieldCls("bookingMode")}>
                  {BOOKING_MODES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="policy" ai={ai("policyId")}>Cancellation policy</Label>
                <select id="policy" value={draft.policyId} onChange={(e) => update("policyId", e.target.value)} className={fieldCls("policyId")}>
                  {POLICIES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Panel>

          {formError && <ErrorNote message={formError} />}

          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" disabled={saving !== null} onClick={() => save(false)} className={ghostButton}>
              {saving === "draft" && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
              Save as draft
            </button>
            <button type="submit" disabled={saving !== null} className={primaryButton}>
              {saving === "publish" && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
              Publish
            </button>
          </div>
        </form>
      )}
    </>
  );
}
