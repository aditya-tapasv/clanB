"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Clock, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { formatDate, formatINR } from "@/lib/format";
import { repo } from "@/lib/data/repo";
import { istDate, istToIso, type VenueSlot } from "@/lib/data/slots";
import type { Resource, Venue } from "@/lib/data/types";

export interface VenueSlotPickerProps {
  venue: Venue;
  resources: Resource[];
}

const noopSubscribe = () => () => {};

/** Today's IST date on the client; null during SSR/hydration so static HTML never shows a stale day. */
function useToday(): string | null {
  return useSyncExternalStore(noopSubscribe, () => istDate(0), () => null);
}

export function VenueSlotPicker({ venue, resources }: VenueSlotPickerProps) {
  const today = useToday();
  const [dayOffset, setDayOffset] = useState(0);
  const [resourceId, setResourceId] = useState<string>(resources[0]?.id ?? "");
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [slots, setSlots] = useState<{ key: string; list: VenueSlot[] }>({ key: "", list: [] });

  const date = today ? istDate(dayOffset) : null;
  const key = date ? `${resourceId}|${date}` : "";
  const loading = !date || slots.key !== key;

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    repo.listVenueSlots(venue.id, resourceId, date).then((list) => {
      if (!cancelled) setSlots({ key: `${resourceId}|${date}`, list });
    });
    return () => {
      cancelled = true;
    };
  }, [venue.id, resourceId, date]);

  const activeResource = resources.find((r) => r.id === resourceId);
  const activeSlot = loading ? undefined : slots.list.find((s) => s.start === selectedStart && s.available);

  const days = [0, 1, 2, 3, 4].map((offset) => {
    const d = today ? istDate(offset) : null;
    return {
      offset,
      weekday: offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : d ? formatDate(istToIso(d, "12:00")).split(",")[0] : "",
      label: d ? formatDate(istToIso(d, "12:00")).split(", ")[1] : "",
    };
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-panel p-6 sm:p-8 space-y-6">
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-mono tracking-wider text-signal">
          REAL-TIME AVAILABILITY
        </span>
        <h3 className="font-display text-2xl font-semibold text-white">
          Reserve a Court or Table Slot
        </h3>
        <p className="text-xs sm:text-sm text-mist">
          Instant booking with direct confirmation. Equipment and amenities provided at check-in.
        </p>
      </div>

      {/* 1. Date Selector Strip */}
      <fieldset className="space-y-2">
        <legend className="block text-xs uppercase font-mono tracking-wider text-mist">1. Select Date</legend>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {days.map((d) => (
            <button
              key={d.offset}
              type="button"
              aria-pressed={dayOffset === d.offset}
              onClick={() => {
                setDayOffset(d.offset);
                setSelectedStart(null);
              }}
              className={cn(
                "rounded-xl border p-3 text-center transition-all",
                dayOffset === d.offset
                  ? "border-signal bg-signal/15 text-white shadow-sm shadow-signal/10"
                  : "border-white/10 bg-white/[0.03] text-mist hover:border-white/20 hover:text-white"
              )}
            >
              <div className="text-xs font-semibold">{d.weekday || " "}</div>
              <div className="min-h-[1rem] text-[11px] font-mono text-mist">{d.label}</div>
            </button>
          ))}
        </div>
      </fieldset>

      {/* 2. Resource / Spot Selector */}
      {resources.length > 0 && (
        <fieldset className="space-y-2 pt-2 border-t border-white/[0.06]">
          <legend className="block pt-2 text-xs uppercase font-mono tracking-wider text-mist">2. Select Spot / Unit</legend>
          <div className="flex flex-wrap gap-2">
            {resources.map((res) => (
              <button
                key={res.id}
                type="button"
                aria-pressed={resourceId === res.id}
                onClick={() => {
                  setResourceId(res.id);
                  setSelectedStart(null);
                }}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs transition-all",
                  resourceId === res.id
                    ? "border-signal bg-signal text-black font-semibold"
                    : "border-white/10 bg-white/5 text-mist hover:border-white/20 hover:text-white"
                )}
              >
                {res.name} ({res.capacity}p · {res.kind})
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* 3. Slot Grid */}
      <fieldset className="space-y-2 pt-2 border-t border-white/[0.06]" aria-busy={loading}>
        <legend className="block pt-2 text-xs uppercase font-mono tracking-wider text-mist">
          {resources.length > 0 ? "3." : "2."} Available Time Slots
        </legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {loading
            ? Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="min-h-[72px] animate-pulse rounded-xl border border-white/5 bg-white/[0.03]" />
              ))
            : slots.list.map((slot) => {
                const isSelected = selectedStart === slot.start;
                return (
                  <button
                    key={slot.start}
                    type="button"
                    disabled={!slot.available}
                    aria-pressed={isSelected}
                    aria-label={`${slot.label}, ${slot.available ? formatINR(slot.price) : "booked"}`}
                    onClick={() => setSelectedStart(slot.start)}
                    className={cn(
                      "rounded-xl border p-3 text-center transition-all flex flex-col justify-between min-h-[72px]",
                      !slot.available
                        ? "border-white/5 bg-white/[0.01] text-white/20 cursor-not-allowed line-through"
                        : isSelected
                        ? "border-signal bg-signal/20 text-white ring-1 ring-signal"
                        : "border-white/10 bg-white/[0.03] text-mist hover:border-signal/50 hover:text-white"
                    )}
                  >
                    <div className="text-xs font-mono font-medium flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3 text-signal" aria-hidden="true" />
                      {slot.start}
                    </div>
                    <div className="text-[11px] font-mono text-mist pt-1">
                      {slot.available ? formatINR(slot.price) : "Booked"}
                    </div>
                  </button>
                );
              })}
        </div>
      </fieldset>

      {/* Selected Slot Summary Bar & Booking CTA */}
      {activeSlot && date && (
        <div className="mt-6 rounded-xl border border-signal/30 bg-signal/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-signal block">
              SELECTED SLOT SUMMARY
            </span>
            <div className="text-sm font-semibold text-white">
              {formatDate(istToIso(date, activeSlot.start))} • {activeSlot.label}
            </div>
            <div className="text-xs text-mist">
              {activeResource?.name ?? "General booking"} at {venue.name}
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-mist block">Rate</span>
              <span className="font-mono text-xl font-semibold text-white">{formatINR(activeSlot.price)}</span>
            </div>

            <Link
              href={`/checkout/slot-${venue.id}?${new URLSearchParams({ resource: resourceId, date, start: activeSlot.start }).toString()}`}
              onClick={() => track("booking_start", { venueId: venue.id, slot: activeSlot.start, date })}
              className="inline-flex items-center gap-2 rounded-full border border-signal bg-signal px-6 py-3 text-xs font-semibold text-black hover:bg-white transition-all duration-200 shadow-md shadow-signal/20"
            >
              <span>Instant Reserve</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-mist">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
          Full refund if cancelled 2h prior
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
          Direct venue confirmation
        </span>
      </div>
    </div>
  );
}
