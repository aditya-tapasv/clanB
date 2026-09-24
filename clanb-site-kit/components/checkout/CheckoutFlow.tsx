"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle, ArrowLeft, CalendarDays, CheckCircle2, Clock3, CreditCard, Landmark,
  Loader2, MapPin, Minus, Plus, ShieldCheck, Smartphone, TicketX,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { useSession } from "@/lib/auth";
import { formatINR, formatSessionTime } from "@/lib/format";
import { DECLINE_TEST_METHOD, isBookingError, repo, type CheckoutItem, type SlotRequest } from "@/lib/data/repo";
import type { Booking, Payment } from "@/lib/data/types";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HoldTimer } from "./HoldTimer";
import { PriceBreakdown } from "./PriceBreakdown";
import { BookingQr } from "./BookingQr";
import { WaitlistForm } from "./WaitlistForm";

type Step =
  | { name: "review" }
  | { name: "signin" }
  | { name: "pay"; booking: Booking; payment: Payment }
  | { name: "confirmed"; booking: Booking; payment: Payment; method: string }
  | { name: "expired" }
  | { name: "full"; message: string }
  | { name: "unavailable"; message: string };

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", hint: "GPay, PhonePe, Paytm", icon: Smartphone },
  { id: "card", label: "Credit / debit card", hint: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "netbanking", label: "Net banking", hint: "All major banks", icon: Landmark },
  { id: DECLINE_TEST_METHOD, label: "Test card — always declines", hint: "Demo only: try the failure path", icon: TicketX },
] as const;

const STEPS = ["Review", "Pay", "Confirmed"] as const;

export interface CheckoutFlowProps {
  item: CheckoutItem;
  initialQuantity: number;
  slot?: SlotRequest;
}

function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2 text-xs" aria-label="Checkout progress">
      {STEPS.map((label, i) => (
        <li key={label} className="flex items-center gap-2" aria-current={i === current ? "step" : undefined}>
          <span
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full border font-mono",
              i < current && "border-signal bg-signal text-ink",
              i === current && "border-signal text-signal",
              i > current && "border-white/15 text-zinc-500"
            )}
          >
            {i < current ? "✓" : i + 1}
          </span>
          <span className={cn(i === current ? "text-white" : "text-zinc-500")}>{label}</span>
          {i < STEPS.length - 1 && <span className="h-px w-6 bg-white/15" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

export function CheckoutFlow({ item, initialQuantity, slot }: CheckoutFlowProps) {
  const session = useSession();
  const { session: bookable, policy } = item;
  const isSlot = item.kind === "slot";
  const venue = item.venue;
  const seatsLeft = Math.max(0, bookable.capacity - bookable.booked);
  const maxQty = isSlot ? 1 : Math.max(1, Math.min(4, seatsLeft));
  const backHref = item.kind === "event" ? `/events/${item.event.slug}` : `/venues/${item.venue.slug}`;

  const [step, setStep] = useState<Step>({ name: "review" });
  const [quantity, setQuantity] = useState(Math.min(Math.max(1, initialQuantity), maxQty));
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [method, setMethod] = useState<string>("upi");
  const [payError, setPayError] = useState<string | null>(null);
  const [promo, setPromo] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const firstStep = useRef(true);

  // Bring each new step into view (not on first load).
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    topRef.current?.scrollIntoView({ block: "start" });
  }, [step.name]);

  const hold = async (userId: string) => {
    setBusy(true);
    try {
      const res = await repo.holdBooking(
        isSlot && slot ? { slot, quantity: 1, userId } : { sessionId: bookable.id, quantity, userId }
      );
      track("booking_hold", { sessionId: bookable.id, quantity: res.booking.quantity });
      setStep({ name: "pay", ...res });
    } catch (err) {
      if (isBookingError(err) && err.code === "CAPACITY_REACHED") setStep({ name: "full", message: err.message });
      else setStep({ name: "unavailable", message: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setBusy(false);
    }
  };

  const startHold = () => {
    if (session.status === "signed-in") hold(session.user.id);
    else setStep({ name: "signin" });
  };

  const applyPromo = async () => {
    if (step.name !== "pay" || !promo.trim()) return;
    setBusy(true);
    try {
      const payment = await repo.applyPromoCode(step.booking.id, promo);
      setStep({ ...step, payment });
      setPromoMsg({ ok: true, text: "Code applied." });
    } catch (err) {
      setPromoMsg({ ok: false, text: isBookingError(err) ? err.message : "Couldn't apply that code." });
    } finally {
      setBusy(false);
    }
  };

  const pay = async () => {
    if (step.name !== "pay") return;
    setBusy(true);
    setPayError(null);
    try {
      const res = await repo.confirmBooking(step.booking.id, method);
      track("booking_confirm", { bookingId: res.booking.id, total: res.payment.total.amount });
      setStep({ name: "confirmed", ...res, method });
    } catch (err) {
      if (isBookingError(err) && err.code === "HOLD_EXPIRED") setStep({ name: "expired" });
      else setPayError(err instanceof Error ? err.message : "Payment failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const onExpire = useCallback(() => setStep({ name: "expired" }), []);

  const stepIndex = step.name === "pay" ? 1 : step.name === "confirmed" ? 2 : 0;

  const summary = (
    <aside className="h-fit space-y-4 rounded-2xl border border-white/10 bg-panel p-6 lg:sticky lg:top-28">
      <span className="font-mono text-[10px] uppercase tracking-wider text-signal">
        {isSlot ? "Venue slot" : "Your booking"}
      </span>
      <h2 className="font-display text-xl font-semibold text-white">{bookable.title}</h2>
      <ul className="space-y-2 text-sm text-mist">
        <li className="flex items-start gap-2">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
          {formatSessionTime(bookable.startsAt, bookable.endsAt)}
        </li>
        {venue && (
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
            {venue.name}, {venue.address.neighbourhood}
          </li>
        )}
        <li className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
          {item.organization.name}
          {item.organization.verified && <span className="text-signal">· Verified</span>}
        </li>
      </ul>
      <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm">
        <span className="text-mist">{isSlot ? "Slot price" : "Price per seat"}</span>
        <span className="font-mono text-white">{formatINR(bookable.price)}</span>
      </div>
    </aside>
  );

  return (
    <div ref={topRef} className="scroll-mt-28 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-mist hover:text-white">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
        </Link>
        <StepIndicator current={stepIndex} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6" aria-live="polite">
          {step.name === "review" && (
            <>
              {!isSlot && (
                <section className="rounded-2xl border border-white/10 bg-panel p-6">
                  <h2 className="font-display text-lg font-semibold text-white">How many seats?</h2>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-mist">
                      {seatsLeft} left · max {maxQty} per booking
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Fewer seats"
                        disabled={quantity <= 1}
                        onClick={() => setQuantity((q) => q - 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-signal disabled:opacity-30"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center font-mono text-lg text-white" aria-live="polite">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="More seats"
                        disabled={quantity >= maxQty}
                        onClick={() => setQuantity((q) => q + 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-signal disabled:opacity-30"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </section>
              )}

              <section className="space-y-4 rounded-2xl border border-white/10 bg-panel p-6">
                <h2 className="font-display text-lg font-semibold text-white">Policies — {policy.name}</h2>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-medium text-white">Cancellation</dt>
                    <dd className="text-mist">{policy.cancellationSummary}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-white">Refunds</dt>
                    <dd className="text-mist">{policy.refundSummary}</dd>
                  </div>
                  {policy.eligibilitySummary && (
                    <div>
                      <dt className="font-medium text-white">Eligibility</dt>
                      <dd className="text-mist">{policy.eligibilitySummary}</dd>
                    </div>
                  )}
                </dl>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm text-white">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#5CF111]"
                  />
                  I&apos;ve read the cancellation and refund policy for this booking.
                </label>
              </section>

              <div className="space-y-3">
                <Button
                  type="button"
                  variant="primary"
                  disabled={!agreed || busy || session.status === "loading"}
                  onClick={startHold}
                  className="w-full sm:w-auto"
                >
                  {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {isSlot ? "Hold this slot" : `Hold ${quantity} seat${quantity > 1 ? "s" : ""}`}
                </Button>
                <p className="flex items-center gap-1.5 text-xs text-mist">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                  We&apos;ll hold it for 10 minutes while you pay. You won&apos;t be charged yet.
                </p>
              </div>
            </>
          )}

          {step.name === "signin" && (
            <section className="rounded-2xl border border-white/10 bg-panel p-6">
              <h2 className="font-display text-lg font-semibold text-white">Sign in to hold your booking</h2>
              <p className="mt-1 text-sm text-mist">
                We need a way to send your QR code and receipt. It takes a few seconds.
              </p>
              <AuthForm mode="login" onSignedIn={(user) => hold(user.id)} className="mt-6 max-w-sm" />
              <button
                type="button"
                onClick={() => setStep({ name: "review" })}
                className="mt-4 text-xs text-mist hover:text-white"
              >
                ← Back to review
              </button>
            </section>
          )}

          {step.name === "pay" && (
            <>
              <HoldTimer heldUntil={step.booking.heldUntil ?? new Date().toISOString()} onExpire={onExpire} />

              <section className="rounded-2xl border border-white/10 bg-panel p-6">
                <h2 className="font-display text-lg font-semibold text-white">Price breakdown</h2>
                <PriceBreakdown payment={step.payment} className="mt-4" />
                <div className="mt-5 flex gap-2">
                  <Input
                    id="promo"
                    aria-label="Promo code"
                    placeholder="Promo code (try FIRSTGAME)"
                    value={promo}
                    onChange={(e) => {
                      setPromo(e.target.value);
                      setPromoMsg(null);
                    }}
                    className="uppercase"
                  />
                  <Button type="button" variant="ghost" disabled={busy || !promo.trim()} onClick={applyPromo} className="shrink-0 py-2.5">
                    Apply
                  </Button>
                </div>
                {promoMsg && (
                  <p role="status" className={cn("mt-2 text-xs", promoMsg.ok ? "text-signal" : "text-rose-400")}>
                    {promoMsg.text}
                  </p>
                )}
              </section>

              <section className="rounded-2xl border border-white/10 bg-panel p-6">
                <h2 className="font-display text-lg font-semibold text-white">Payment method</h2>
                <div role="radiogroup" aria-label="Payment method" className="mt-4 grid gap-2 sm:grid-cols-2">
                  {PAYMENT_METHODS.map((m) => {
                    const Icon = m.icon;
                    const selected = method === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => {
                          setMethod(m.id);
                          setPayError(null);
                        }}
                        className={cn(
                          "flex items-start gap-3 rounded-xl border p-3 text-left transition",
                          selected ? "border-signal bg-signal/10" : "border-white/10 hover:border-white/25"
                        )}
                      >
                        <Icon className={cn("mt-0.5 h-4 w-4", selected ? "text-signal" : "text-mist")} aria-hidden="true" />
                        <span>
                          <span className="block text-sm font-medium text-white">{m.label}</span>
                          <span className="block text-xs text-mist">{m.hint}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {payError && (
                  <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                      {payError} Your seats are still held — choose another method and try again.
                    </span>
                  </div>
                )}

                <Button type="button" variant="primary" disabled={busy} onClick={pay} className="mt-6 w-full">
                  {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  Pay {formatINR(step.payment.total)}
                </Button>
                <p className="mt-2 text-center font-mono text-[10px] text-zinc-500">
                  Demo checkout — no real payment is taken.
                </p>
              </section>
            </>
          )}

          {step.name === "confirmed" && (
            <section className="space-y-6 rounded-2xl border border-signal/30 bg-panel p-6 md:p-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-8 w-8 shrink-0 text-signal" aria-hidden="true" />
                <div>
                  <h2 className="font-display text-2xl font-semibold text-white">You&apos;re booked!</h2>
                  <p className="mt-1 text-sm text-mist">
                    Show this QR code at check-in. We&apos;ve sent the receipt to{" "}
                    {session.status === "signed-in" ? session.user.email : "your email"}.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <BookingQr bookingId={step.booking.id} code={step.booking.confirmationCode ?? step.booking.id} />
                <div className="w-full flex-1 space-y-3">
                  <h3 className="font-mono text-[10px] uppercase tracking-wider text-mist">Receipt</h3>
                  <PriceBreakdown payment={step.payment} />
                  <p className="font-mono text-[10px] text-zinc-500">
                    Paid via {PAYMENT_METHODS.find((m) => m.id === step.method)?.label ?? step.method} · Ref{" "}
                    {step.payment.providerReference}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href="/me" variant="primary" withArrow>
                  View in My Clan B
                </Button>
                <Button href="/play" variant="ghost">
                  Find another game
                </Button>
              </div>
            </section>
          )}

          {step.name === "expired" && (
            <section role="alert" className="space-y-4 rounded-2xl border border-amber-500/30 bg-panel p-6">
              <Clock3 className="h-8 w-8 text-amber-400" aria-hidden="true" />
              <h2 className="font-display text-2xl font-semibold text-white">Your hold expired</h2>
              <p className="text-sm text-mist">
                We released the seats after 10 minutes so others could book. You weren&apos;t charged.
              </p>
              <Button type="button" variant="primary" onClick={() => setStep({ name: "review" })}>
                Start again
              </Button>
            </section>
          )}

          {step.name === "full" && (
            <section role="alert" className="space-y-4 rounded-2xl border border-amber-500/30 bg-panel p-6">
              <TicketX className="h-8 w-8 text-amber-400" aria-hidden="true" />
              <h2 className="font-display text-2xl font-semibold text-white">Just missed it</h2>
              <p className="text-sm text-mist">{step.message}</p>
              <div className="flex flex-wrap gap-3">
                {item.kind === "event" ? (
                  <div className="w-full max-w-sm">
                    <WaitlistForm sessionId={bookable.id} />
                  </div>
                ) : (
                  <Button href={backHref} variant="primary">
                    Pick another slot
                  </Button>
                )}
                {!isSlot && seatsLeft > 0 && (
                  <Button type="button" variant="ghost" onClick={() => setStep({ name: "review" })}>
                    Change seats
                  </Button>
                )}
              </div>
            </section>
          )}

          {step.name === "unavailable" && (
            <section role="alert" className="space-y-4 rounded-2xl border border-rose-500/30 bg-panel p-6">
              <AlertTriangle className="h-8 w-8 text-rose-400" aria-hidden="true" />
              <h2 className="font-display text-2xl font-semibold text-white">This can&apos;t be booked</h2>
              <p className="text-sm text-mist">{step.message}</p>
              <Button href="/play" variant="primary">
                Find something else
              </Button>
            </section>
          )}
        </div>

        {summary}
      </div>
    </div>
  );
}
