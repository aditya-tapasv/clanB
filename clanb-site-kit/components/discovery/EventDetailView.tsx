"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar, MapPin, Clock, Users, ShieldCheck, CheckCircle2,
  AlertCircle, HelpCircle, ArrowRight, Share2, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { track } from "@/lib/analytics";
import { WaitlistForm } from "@/components/checkout/WaitlistForm";
import type { EventDetail } from "@/lib/data/repo";

export interface EventDetailViewProps {
  data: EventDetail;
}

export function EventDetailView({ data }: EventDetailViewProps) {
  const { event, service, activity, venue, organization, policy, resource } = data;
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const seatsLeft = Math.max(0, event.capacity - event.booked);
  const isFullOrWaitlist = event.status === "full" || event.status === "waitlist" || seatsLeft === 0;
  const isCancelled = event.status === "cancelled";

  const formattedDate = new Date(event.startsAt).toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = `${new Date(event.startsAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })} – ${new Date(event.endsAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })} IST`;

  const basePricePaise = event.price.amount;
  const totalPaise = basePricePaise * quantity;
  const priceDisplay = `₹${(basePricePaise / 100).toLocaleString("en-IN")}`;
  const totalPriceDisplay = `₹${(totalPaise / 100).toLocaleString("en-IN")}`;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Left Column: Details & Information */}
      <div className="lg:col-span-8 space-y-10">
        {/* Header Block */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="signal" className="uppercase font-mono text-[11px]">
              {service.type.replace("-", " ")}
            </Badge>
            {activity && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-mist">
                {activity.category}
              </span>
            )}
            <Badge
              variant={
                event.status === "open"
                  ? "signal"
                  : event.status === "waitlist"
                  ? "amber"
                  : event.status === "cancelled"
                  ? "outline"
                  : "outline"
              }
              className="capitalize"
            >
              {event.status}
            </Badge>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight leading-[1.12]">
            {event.title}
          </h1>

          {/* Host info bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-mist pt-2">
            <div className="flex items-center gap-2">
              <span className="text-white/60">Organized by</span>
              <Link href={`/providers/${organization.slug}`} className="font-semibold text-white hover:text-signal">
                {organization.name}
              </Link>
              {organization.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] text-signal font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified Host
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1 text-mist hover:text-white transition-colors ml-auto"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Quick Spec Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-mist flex items-center gap-1">
              <Calendar className="h-3 w-3 text-signal" />
              Date
            </span>
            <div className="text-xs sm:text-sm font-medium text-white truncate">{formattedDate}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-mist flex items-center gap-1">
              <Clock className="h-3 w-3 text-signal" />
              Time
            </span>
            <div className="text-xs sm:text-sm font-medium text-white truncate">{formattedTime}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-mist flex items-center gap-1">
              <Users className="h-3 w-3 text-signal" />
              Capacity
            </span>
            <div className="text-xs sm:text-sm font-medium text-white">
              {event.capacity} seats ({seatsLeft} left)
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-mist flex items-center gap-1">
              <MapPin className="h-3 w-3 text-signal" />
              Location
            </span>
            <div className="text-xs sm:text-sm font-medium text-white truncate">
              {venue?.address.neighbourhood ?? "Bengaluru"}
            </div>
          </div>
        </div>

        {/* Overview & Description */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-white">About This Session</h2>
          <p className="text-base text-mist/90 leading-relaxed">{event.summary}</p>
          <p className="text-sm text-mist leading-relaxed">{service.description}</p>
        </div>

        {/* Activity Details & Format */}
        {activity && (
          <div className="rounded-2xl border border-white/10 bg-panel p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold text-white">
              Game & Experience Profile
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-white/60 block">Skill Level</span>
                <span className="text-white font-medium capitalize">{activity.skill.replace("-", " ")}</span>
              </div>
              {activity.complexity && (
                <div>
                  <span className="text-white/60 block">Complexity</span>
                  <span className="text-white font-medium capitalize">{activity.complexity}</span>
                </div>
              )}
              <div>
                <span className="text-white/60 block">Typical Duration</span>
                <span className="text-white font-medium">{activity.durationMin} minutes</span>
              </div>
              <div>
                <span className="text-white/60 block">Player Count</span>
                <span className="text-white font-medium">{activity.playerMin}–{activity.playerMax} players</span>
              </div>
              <div>
                <span className="text-white/60 block">Format</span>
                <span className="text-white font-medium">{activity.format}</span>
              </div>
              <div>
                <span className="text-white/60 block">Vibe & Mood</span>
                <span className="text-signal font-medium">{activity.moods.join(", ")}</span>
              </div>
            </div>
          </div>
        )}

        {/* Venue Information */}
        {venue && (
          <div className="rounded-2xl border border-white/10 bg-panel p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-signal">
                  VENUE PARTNER
                </span>
                <h3 className="font-display text-xl font-semibold text-white">{venue.name}</h3>
              </div>
              <Link
                href={`/venues/${venue.slug}`}
                className="text-xs text-signal hover:underline flex items-center gap-1 font-mono"
              >
                View Venue Profile
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <p className="text-sm text-mist">{venue.description}</p>

            <div className="flex items-start gap-2 text-xs text-mist">
              <MapPin className="h-4 w-4 text-signal shrink-0 mt-0.5" />
              <div>
                <div>{venue.address.line1}</div>
                <div>
                  {venue.address.neighbourhood}, {venue.address.city} – {venue.address.postalCode}
                </div>
              </div>
            </div>

            {resource && (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs text-mist flex items-center justify-between">
                <span>Reserved Spot: <strong className="text-white">{resource.name}</strong></span>
                <span className="font-mono text-signal">{resource.indoor ? "Indoor AC" : "Outdoor Turf"}</span>
              </div>
            )}

            {venue.amenities.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-xs text-white/60">Venue Amenities:</span>
                <div className="flex flex-wrap gap-1.5">
                  {venue.amenities.map((am) => (
                    <span
                      key={am}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-mist"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rules & Inclusions */}
        <div className="rounded-2xl border border-white/10 bg-panel p-6 space-y-3">
          <h3 className="font-display text-lg font-semibold text-white">What’s Included & House Rules</h3>
          <ul className="space-y-2 text-xs text-mist">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-signal shrink-0 mt-0.5" />
              <span>Full game materials, clean sleeves, and premium accessories provided on table.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-signal shrink-0 mt-0.5" />
              <span>Dedicated game master / arbiter introduces rules and answers questions throughout play.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-signal shrink-0 mt-0.5" />
              <span>Complimentary high-speed Wi-Fi and chilled water stations.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Please arrive 10 minutes prior to scheduled start time for smooth seat allocations.</span>
            </li>
          </ul>
        </div>

        {/* Cancellation & Refund Policy */}
        <div className="rounded-2xl border border-white/10 bg-panel p-6 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-signal" />
            <h3 className="font-display text-lg font-semibold text-white">
              Cancellation Policy ({policy.name})
            </h3>
          </div>
          <div className="text-xs space-y-2 text-mist">
            <p><strong>Cancellation:</strong> {policy.cancellationSummary}</p>
            <p><strong>Refund Timeline:</strong> {policy.refundSummary}</p>
            <p className="text-white/60">
              Cancellations can be initiated directly from your My Clan B dashboard up to the stated window.
            </p>
          </div>
        </div>

        {/* Emergency & Support */}
        <div className="rounded-xl border border-white/[0.08] p-4 text-xs text-mist flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-signal" />
            <span>Need host assistance or running late?</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="mailto:hello@clanb.in" className="text-signal hover:underline font-mono">
              hello@clanb.in
            </a>
            <span className="text-white/20">|</span>
            <span className="text-white/70">Support: +91 80 4920 1888</span>
          </div>
        </div>
      </div>

      {/* Right Column: Sticky Booking Card (USR-04 / USR-09) */}
      <div className="lg:col-span-4">
        <div className="sticky top-28 rounded-2xl border border-white/15 bg-panel p-6 shadow-2xl space-y-6">
          {/* Price Header */}
          <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-mist block">
                Price per seat
              </span>
              <span className="font-mono text-3xl font-semibold text-white">{priceDisplay}</span>
            </div>
            <Badge
              variant={isCancelled ? "outline" : isFullOrWaitlist ? "amber" : "signal"}
              className="capitalize"
            >
              {event.status}
            </Badge>
          </div>

          {/* Capacity Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-mist">
              <span>Availability</span>
              <span className={cn(seatsLeft <= 2 && !isCancelled ? "text-amber-400 font-semibold" : "text-white")}>
                {isCancelled
                  ? "Event Cancelled"
                  : isFullOrWaitlist
                  ? "Fully Booked"
                  : `${seatsLeft} of ${event.capacity} seats remaining`}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  isCancelled
                    ? "bg-white/20"
                    : isFullOrWaitlist
                    ? "bg-amber-400"
                    : "bg-signal"
                )}
                style={{
                  width: `${Math.min(100, Math.round((event.booked / event.capacity) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Conditional Booking State */}
          {isCancelled ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-300 space-y-2">
              <div className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" />
                This event has been cancelled
              </div>
              <p>All registered players have been refunded. Browse other available sessions on Clan B.</p>
              <Link
                href="/play"
                className="inline-block mt-2 font-mono text-signal hover:underline"
              >
                Browse other sessions →
              </Link>
            </div>
          ) : isFullOrWaitlist ? (
            /* Waitlist Form State (USR-09) */
            <div id="waitlist" className="scroll-mt-28 space-y-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                <Sparkles className="h-4 w-4" />
                <span>Seats are full · Waitlist is active</span>
              </div>
              <p className="text-xs text-mist leading-relaxed">
                If a registered player cancels or a second table is opened, waitlist participants are notified in order.
              </p>

              <WaitlistForm sessionId={event.id} />
            </div>
          ) : (
            /* Active Booking Form (USR-04) */
            <div className="space-y-5">
              {/* Quantity Counter */}
              <div className="space-y-2">
                <label className="block text-xs uppercase font-mono tracking-wider text-mist">
                  Select Seats
                </label>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2">
                  <span className="text-xs text-white/70 pl-2">Number of players</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/10 disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="font-mono text-base font-semibold text-white w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= Math.min(seatsLeft, 4)}
                      onClick={() => setQuantity(Math.min(seatsLeft, quantity + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/10 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs space-y-1.5 text-mist">
                <div className="flex justify-between">
                  <span>{priceDisplay} × {quantity} seat{quantity > 1 ? "s" : ""}</span>
                  <span className="font-mono text-white">{totalPriceDisplay}</span>
                </div>
                <div className="flex justify-between text-white/50 text-[11px]">
                  <span>Estimated platform fee & taxes</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-white/[0.08] pt-2 flex justify-between font-semibold text-white">
                  <span>Subtotal</span>
                  <span className="font-mono text-signal">{totalPriceDisplay}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href={`/checkout/${event.id}?quantity=${quantity}`}
                onClick={() => track("booking_start", { eventId: event.id, quantity })}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-signal bg-signal px-6 py-3.5 text-sm font-semibold text-black hover:bg-white transition-all duration-200 shadow-lg shadow-signal/20"
              >
                <span>Reserve {quantity} Seat{quantity > 1 ? "s" : ""}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Guarantee Badges */}
          <div className="pt-2 border-t border-white/[0.06] space-y-2 text-[11px] text-mist">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-signal shrink-0" />
              <span>Instant confirmation & QR check-in pass</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-signal shrink-0" />
              <span>Full refund if cancelled up to {policy.name.toLowerCase()} window</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
