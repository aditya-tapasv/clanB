"use client";

import React, { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { formatDate, formatTime } from "@/lib/format";
import { repo } from "@/lib/data/repo";
import type { OpeningHoursDay } from "@/lib/data/types";
import { useProviderData } from "./ProviderContext";
import { loadInventory } from "./loaders";
import {
  ErrorNote, LoadingBlock, PageHeader, Panel, TableScroll, dangerButton, inputClass, primaryButton, tableClass, tdClass, thClass,
} from "./ui";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function HoursEditor({ venueId, initial, onSaved }: { venueId: string; initial: OpeningHoursDay[]; onSaved: () => void }) {
  const [days, setDays] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const set = (i: number, patch: Partial<OpeningHoursDay>) => {
    setDays((d) => d.map((x, j) => (j === i ? { ...x, ...patch } : x)));
    setMsg(null);
  };

  const save = async () => {
    setSaving(true);
    try {
      await repo.setOpeningHours(venueId, days);
      setMsg({ ok: true, text: "Hours saved." });
      onSaved();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Couldn't save." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <ul className="divide-y divide-white/[0.06]">
        {days.map((d, i) => (
          <li key={d.day} className="grid grid-cols-[6.5rem_auto_1fr] items-center gap-3 py-1.5 sm:grid-cols-[7rem_6rem_1fr]">
            <span className="text-white">{DAY_NAMES[d.day]}</span>
            <label className="flex items-center gap-1.5 text-[12px] text-mist">
              <input type="checkbox" checked={d.closed} onChange={(e) => set(i, { closed: e.target.checked })} className="accent-[#5CF111]" />
              Closed
            </label>
            <div className="flex items-center gap-1.5">
              <label className="sr-only" htmlFor={`${venueId}-open-${d.day}`}>
                {DAY_NAMES[d.day]} opens
              </label>
              <input id={`${venueId}-open-${d.day}`} type="time" disabled={d.closed} value={d.open} onChange={(e) => set(i, { open: e.target.value })} className={`${inputClass} w-28`} />
              <span className="text-zinc-500">–</span>
              <label className="sr-only" htmlFor={`${venueId}-close-${d.day}`}>
                {DAY_NAMES[d.day]} closes
              </label>
              <input id={`${venueId}-close-${d.day}`} type="time" disabled={d.closed} value={d.close} onChange={(e) => set(i, { close: e.target.value })} className={`${inputClass} w-28`} />
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3">
        <button type="button" onClick={save} disabled={saving} className={primaryButton}>
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
          Save hours
        </button>
        {msg && (
          <span role={msg.ok ? "status" : "alert"} className={msg.ok ? "text-[13px] text-signal" : "text-[13px] text-rose-300"}>
            {msg.text}
          </span>
        )}
      </div>
    </div>
  );
}

export function InventoryView() {
  const { data, loading, error, reload } = useProviderData(loadInventory);
  const [venueId, setVenueId] = useState<string | undefined>();
  const [form, setForm] = useState({ resourceId: "", start: "", end: "", reason: "" });
  const [adding, setAdding] = useState(false);
  const [blackoutError, setBlackoutError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const activeVenue = data?.venues.find((v) => v.id === venueId) ?? data?.venues[0];
  const hours = data?.hours.find((h) => h.venueId === activeVenue?.id);

  const addBlackout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVenue) return;
    if (!form.start || !form.end || !form.reason.trim()) {
      setBlackoutError("Add a start, an end and a reason.");
      return;
    }
    setAdding(true);
    setBlackoutError(null);
    try {
      await repo.addBlackout({
        venueId: activeVenue.id,
        resourceId: form.resourceId || undefined,
        // datetime-local values are entered in IST.
        startsAt: new Date(`${form.start}:00+05:30`).toISOString(),
        endsAt: new Date(`${form.end}:00+05:30`).toISOString(),
        reason: form.reason.trim(),
      });
      setForm({ resourceId: "", start: "", end: "", reason: "" });
      reload();
    } catch (err) {
      setBlackoutError(err instanceof Error ? err.message : "Couldn't add the blackout.");
    } finally {
      setAdding(false);
    }
  };

  const remove = async (id: string) => {
    setRemoving(id);
    try {
      await repo.removeBlackout(id);
      reload();
    } finally {
      setRemoving(null);
    }
  };

  return (
    <>
      <PageHeader title="Inventory" description="Tables, courts and rooms, when they're open, and when they're blocked." />
      {error && <ErrorNote message={error} onRetry={reload} />}
      {!data ? (
        loading && <LoadingBlock rows={8} />
      ) : data.venues.length === 0 || !activeVenue ? (
        <p className="rounded-lg border border-white/10 bg-panel p-4 text-[13px] text-mist">
          This organization doesn&apos;t operate its own venue — it hosts at partner venues, so there&apos;s no inventory to manage.
        </p>
      ) : (
        <div className="space-y-5">
          {data.venues.length > 1 && (
            <div>
              <label htmlFor="inv-venue" className="sr-only">
                Venue
              </label>
              <select id="inv-venue" value={activeVenue.id} onChange={(e) => setVenueId(e.target.value)} className={`${inputClass} max-w-sm`}>
                {data.venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <TableScroll label="Resources">
            <table className={tableClass}>
              <caption className="border-b border-white/10 px-3 py-2 text-left text-[13px] font-semibold uppercase tracking-wide text-mist">
                Resources · {activeVenue.name}
              </caption>
              <thead>
                <tr>
                  <th scope="col" className={thClass}>Name</th>
                  <th scope="col" className={thClass}>Kind</th>
                  <th scope="col" className={`${thClass} text-right`}>Capacity</th>
                  <th scope="col" className={thClass}>Setting</th>
                  <th scope="col" className={thClass}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.resources
                  .filter((r) => r.venueId === activeVenue.id)
                  .map((r) => (
                    <tr key={r.id}>
                      <td className={tdClass}>{r.name}</td>
                      <td className={`${tdClass} capitalize text-mist`}>{r.kind}</td>
                      <td className={`${tdClass} text-right font-mono`}>{r.capacity}</td>
                      <td className={`${tdClass} text-mist`}>{r.indoor ? "Indoor" : "Outdoor"}</td>
                      <td className={tdClass}>{r.active ? <span className="text-signal">Active</span> : <span className="text-zinc-500">Inactive</span>}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </TableScroll>

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title="Opening hours (IST)">
              {hours && <HoursEditor key={activeVenue.id} venueId={activeVenue.id} initial={hours.days} onSaved={reload} />}
            </Panel>

            <Panel title="Blackout windows">
              <form onSubmit={addBlackout} noValidate className="grid gap-2 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="bo-resource" className="mb-1 block text-[12px] text-mist">
                    Applies to
                  </label>
                  <select id="bo-resource" value={form.resourceId} onChange={(e) => setForm({ ...form, resourceId: e.target.value })} className={inputClass}>
                    <option value="">Whole venue</option>
                    {data.resources
                      .filter((r) => r.venueId === activeVenue.id)
                      .map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="bo-start" className="mb-1 block text-[12px] text-mist">
                    Starts
                  </label>
                  <input id="bo-start" type="datetime-local" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="bo-end" className="mb-1 block text-[12px] text-mist">
                    Ends
                  </label>
                  <input id="bo-end" type="datetime-local" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="bo-reason" className="mb-1 block text-[12px] text-mist">
                    Reason
                  </label>
                  <input id="bo-reason" value={form.reason} placeholder="Maintenance, private event…" onChange={(e) => setForm({ ...form, reason: e.target.value })} className={inputClass} />
                </div>
                {blackoutError && (
                  <div className="sm:col-span-2">
                    <ErrorNote message={blackoutError} />
                  </div>
                )}
                <div className="sm:col-span-2">
                  <button type="submit" disabled={adding} className={primaryButton}>
                    {adding && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                    Add blackout
                  </button>
                </div>
              </form>

              <ul className="mt-4 divide-y divide-white/[0.06] border-t border-white/10">
                {data.blackouts.filter((b) => b.venueId === activeVenue.id).length === 0 && (
                  <li className="py-2 text-[13px] text-mist">No blackouts scheduled.</li>
                )}
                {data.blackouts
                  .filter((b) => b.venueId === activeVenue.id)
                  .map((b) => (
                    <li key={b.id} className="flex items-center justify-between gap-2 py-2 text-[13px]">
                      <div>
                        <p className="text-white">{b.reason}</p>
                        <p className="text-[12px] text-mist">
                          {formatDate(b.startsAt)} {formatTime(b.startsAt)} → {formatDate(b.endsAt)} {formatTime(b.endsAt)} ·{" "}
                          {data.resources.find((r) => r.id === b.resourceId)?.name ?? "Whole venue"}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove blackout: ${b.reason}`}
                        disabled={removing === b.id}
                        onClick={() => remove(b.id)}
                        className={dangerButton}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
              </ul>
            </Panel>
          </div>
        </div>
      )}
    </>
  );
}
