"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Loader2, LogOut, MapPin, Receipt, Ticket, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { signOut, updateProfile, useSession, type SessionUser } from "@/lib/auth";
import { hrefFor, toggleSaved, useSaved, type SavedKind } from "@/lib/saved";
import { formatINR, formatSessionTime } from "@/lib/format";
import { isBookingError, repo, type BookingDetail } from "@/lib/data/repo";
import { track } from "@/lib/analytics";
import { Tabs } from "@/components/ui/Tabs";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { PriceBreakdown } from "@/components/checkout/PriceBreakdown";
import { BookingQr } from "@/components/checkout/BookingQr";

type TabId = "upcoming" | "past" | "saved" | "profile";

const STATE_BADGE: Record<string, BadgeVariant> = {
  confirmed: "signal",
  completed: "cyan",
  cancelled: "outline",
  refunded: "amber",
  "no-show": "outline",
};

const SAVED_LABELS: Record<SavedKind, string> = {
  event: "Saved events",
  venue: "Saved venues",
  game: "Following — games",
  sport: "Following — sports",
};

function detailHref(d: BookingDetail): string | undefined {
  if (d.event) return `/events/${d.event.slug}`;
  if (d.venue) return `/venues/${d.venue.slug}`;
  return undefined;
}

function BookingRow({ detail, upcoming, onCancel }: { detail: BookingDetail; upcoming: boolean; onCancel: () => void }) {
  const [open, setOpen] = useState(false);
  const { booking, session, venue, payment } = detail;
  const href = detailHref(detail);

  return (
    <li className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={STATE_BADGE[booking.state] ?? "default"} className="capitalize">
              {booking.state}
            </Badge>
            <span className="font-mono text-[11px] text-zinc-500">{booking.confirmationCode}</span>
          </div>
          <h3 className="font-display text-lg font-semibold text-white">
            {href ? (
              <Link href={href} className="hover:text-signal">
                {session.title}
              </Link>
            ) : (
              session.title
            )}
          </h3>
          <p className="flex items-center gap-1.5 text-sm text-mist">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {formatSessionTime(session.startsAt, session.endsAt)}
          </p>
          {venue && (
            <p className="flex items-center gap-1.5 text-sm text-mist">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {venue.name}, {venue.address.neighbourhood}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
          {payment && <span className="font-mono text-white">{formatINR(payment.total)}</span>}
          <div className="flex gap-2">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white hover:border-white/30"
            >
              <Receipt className="h-3.5 w-3.5" aria-hidden="true" /> Receipt
            </button>
            {upcoming && booking.state === "confirmed" && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/10"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" /> Cancel
              </button>
            )}
          </div>
        </div>
      </div>
      {open && payment && (
        <div className="mt-5 grid gap-6 border-t border-white/10 pt-5 sm:grid-cols-[auto_1fr]">
          {booking.state === "confirmed" && booking.confirmationCode && (
            <BookingQr bookingId={booking.id} code={booking.confirmationCode} size={112} />
          )}
          <div className="space-y-2">
            <PriceBreakdown payment={payment} />
            <p className="font-mono text-[10px] capitalize text-zinc-500">
              Payment {payment.state}
              {payment.providerReference && ` · Ref ${payment.providerReference}`}
            </p>
          </div>
        </div>
      )}
    </li>
  );
}

function ProfileForm({ user }: { user: SessionUser }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [saved, setSaved] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateProfile({ name: name.trim() || user.name, phone: phone.trim() || undefined });
        setSaved(true);
      }}
      className="max-w-md space-y-4 rounded-2xl border border-white/10 bg-panel p-6"
    >
      <div>
        <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium text-white">
          Name
        </label>
        <Input id="profile-name" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} />
      </div>
      <div>
        <label htmlFor="profile-email" className="mb-1.5 block text-sm font-medium text-white">
          Email
        </label>
        <Input id="profile-email" value={user.email} readOnly disabled />
      </div>
      <div>
        <label htmlFor="profile-phone" className="mb-1.5 block text-sm font-medium text-white">
          Phone <span className="text-mist">(optional)</span>
        </label>
        <Input id="profile-phone" type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setSaved(false); }} />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary">
          Save profile
        </Button>
        {saved && (
          <span role="status" className="text-xs text-signal">
            Saved.
          </span>
        )}
      </div>
    </form>
  );
}

export function MyClanB() {
  const session = useSession();
  const saved = useSaved();
  const [tab, setTab] = useState<TabId>("upcoming");
  const [data, setData] = useState<{ userId: string; list: BookingDetail[]; now: number } | null>(null);
  const [cancelling, setCancelling] = useState<BookingDetail | null>(null);
  const [cancelBusy, setCancelBusy] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const userId = session.status === "signed-in" ? session.user.id : null;

  const load = useCallback(async (id: string) => {
    const list = await repo.listMyBookings(id);
    setData({ userId: id, list, now: Date.now() });
  }, []);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    repo.listMyBookings(userId).then((list) => {
      if (!cancelled) setData({ userId, list, now: Date.now() });
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (session.status === "loading") {
    return <div className="h-64 animate-pulse rounded-2xl bg-white/[0.03]" aria-busy="true" aria-label="Loading" />;
  }

  if (session.status === "signed-out") {
    return (
      <EmptyState
        icon={Ticket}
        title="Sign in to see your bookings"
        description="Your QR codes, receipts, saves and follows live here."
        actionLabel="Sign in"
        actionHref="/login?next=/me"
      />
    );
  }

  const user = session.user;
  const loading = !data || data.userId !== user.id;
  const list = loading ? [] : data.list;
  const now = data?.now ?? 0;
  const isUpcoming = (d: BookingDetail) => d.booking.state === "confirmed" && Date.parse(d.session.endsAt) > now;
  const upcoming = list.filter(isUpcoming);
  const past = list.filter((d) => !isUpcoming(d)).reverse();
  const next = upcoming[0];

  const confirmCancel = async () => {
    if (!cancelling) return;
    setCancelBusy(true);
    setCancelError(null);
    try {
      await repo.cancelBooking(cancelling.booking.id);
      track("booking_cancel", { bookingId: cancelling.booking.id });
      setCancelling(null);
      await load(user.id);
    } catch (err) {
      setCancelError(isBookingError(err) ? err.message : "Couldn't cancel. Try again.");
    } finally {
      setCancelBusy(false);
    }
  };

  const tabs = [
    { id: "upcoming", label: "Upcoming", count: loading ? undefined : upcoming.length },
    { id: "past", label: "Past", count: loading ? undefined : past.length },
    { id: "saved", label: "Saved & following", count: saved.length },
    { id: "profile", label: "Profile" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-signal">My Clan B</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-5xl">Hi, {user.name}</h1>
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          className="inline-flex items-center gap-1.5 text-sm text-mist hover:text-white"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
        </button>
      </div>

      {next && (
        <section aria-labelledby="next-heading" className="flex flex-col gap-6 rounded-2xl border border-signal/30 bg-signal/5 p-6 sm:flex-row sm:items-center">
          <BookingQr bookingId={next.booking.id} code={next.booking.confirmationCode ?? next.booking.id} size={120} />
          <div className="space-y-2">
            <h2 id="next-heading" className="font-mono text-[10px] uppercase tracking-wider text-signal">
              Next up
            </h2>
            <p className="font-display text-2xl font-semibold text-white">{next.session.title}</p>
            <p className="text-sm text-mist">{formatSessionTime(next.session.startsAt, next.session.endsAt)}</p>
            {next.venue && <p className="text-sm text-mist">{next.venue.name}, {next.venue.address.neighbourhood}</p>}
            <p className="text-xs text-zinc-400">
              {next.booking.quantity} {next.booking.quantity === 1 ? "spot" : "spots"} · show the QR at check-in
            </p>
          </div>
        </section>
      )}

      <div className="space-y-6">
        <Tabs idPrefix="me" tabs={tabs} activeId={tab} onChange={(id) => setTab(id as TabId)} />

        <div id="me-panel" role="tabpanel" aria-labelledby={`me-tab-${tab}`}>
          {(tab === "upcoming" || tab === "past") &&
            (loading ? (
              <div className="flex items-center gap-2 text-sm text-mist">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading bookings…
              </div>
            ) : (tab === "upcoming" ? upcoming : past).length === 0 ? (
              <EmptyState
                icon={Ticket}
                title={tab === "upcoming" ? "No upcoming bookings" : "Nothing here yet"}
                description={tab === "upcoming" ? "Find a table or a court for this week." : "Bookings you've played or cancelled show up here."}
                actionLabel="Find something to play"
                actionHref="/play"
              />
            ) : (
              <ul className="space-y-4">
                {(tab === "upcoming" ? upcoming : past).map((d) => (
                  <BookingRow
                    key={d.booking.id}
                    detail={d}
                    upcoming={tab === "upcoming"}
                    onCancel={() => {
                      setCancelError(null);
                      setCancelling(d);
                    }}
                  />
                ))}
              </ul>
            ))}

          {tab === "saved" &&
            (saved.length === 0 ? (
              <EmptyState
                title="No saves or follows yet"
                description="Save events and venues, or follow games and sports, to keep them here."
                actionLabel="Browse games"
                actionHref="/games"
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {(Object.keys(SAVED_LABELS) as SavedKind[]).map((kind) => {
                  const items = saved.filter((s) => s.kind === kind);
                  if (!items.length) return null;
                  return (
                    <section key={kind} className="rounded-2xl border border-white/10 bg-panel p-5">
                      <h2 className="font-mono text-[10px] uppercase tracking-wider text-mist">{SAVED_LABELS[kind]}</h2>
                      <ul className="mt-3 divide-y divide-white/[0.06]">
                        {items.map((item) => (
                          <li key={item.slug} className="flex items-center justify-between gap-3 py-2.5">
                            <Link href={hrefFor(item)} className="text-sm text-white hover:text-signal">
                              {item.title}
                            </Link>
                            <button
                              type="button"
                              onClick={() => toggleSaved(item)}
                              className={cn("text-xs text-mist hover:text-rose-300")}
                            >
                              {kind === "game" || kind === "sport" ? "Unfollow" : "Remove"}
                              <span className="sr-only"> {item.title}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>
            ))}

          {tab === "profile" && <ProfileForm key={user.id} user={user} />}
        </div>
      </div>

      <Dialog
        open={cancelling !== null}
        onClose={() => setCancelling(null)}
        title="Cancel this booking?"
        description={cancelling?.session.title}
      >
        {cancelling && (
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
              <p className="font-medium text-white">{cancelling.policy?.name ?? "Cancellation"} policy</p>
              <p className="mt-1 text-mist">{cancelling.policy?.cancellationSummary}</p>
              <p className="mt-1 text-mist">{cancelling.policy?.refundSummary}</p>
            </div>
            {cancelError && (
              <p role="alert" className="text-sm text-rose-400">
                {cancelError}
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setCancelling(null)}>
                Keep booking
              </Button>
              <button
                type="button"
                disabled={cancelBusy}
                onClick={confirmCancel}
                className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:opacity-60"
              >
                {cancelBusy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                Cancel booking
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
