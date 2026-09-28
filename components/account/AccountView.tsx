"use client";

import React, { useEffect, useState } from "react";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyNote, LoadingRows, Panel, StatusBadge } from "@/components/dashboard/ui";
import { useSession } from "@/components/auth/SessionProvider";
import { initials } from "@/components/auth/AccountMenu";
import { listMyBookings } from "@/lib/api/account";
import type { BookingDetail } from "@/lib/data/repo";
import { ROLE_HOME, ROLE_LABEL } from "@/lib/auth/roles";
import { formatINR, formatSessionTime } from "@/lib/format";

/** Player account: profile + bookings, inside the normal site chrome. */
export function AccountView() {
  const { user, logout } = useSession();
  const [bookings, setBookings] = useState<BookingDetail[] | null>(null);

  useEffect(() => {
    void listMyBookings().then(setBookings);
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <Panel className="h-fit p-6">
        {user ? (
          <>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-signal font-mono text-lg font-bold text-ink">
              {initials(user.name)}
            </span>
            <p className="mt-4 font-display text-xl font-semibold text-white">{user.name}</p>
            <p className="text-sm text-mist">{user.email ?? user.phone}</p>
            <span className="mt-3 inline-block rounded-full border border-signal/30 bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-signal">
              {ROLE_LABEL[user.role]}
            </span>
            <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-5">
              {user.role !== "user" && (
                <Button href={ROLE_HOME[user.role]} variant="signal-ghost" className="justify-center">
                  <LayoutDashboard className="h-4 w-4" />
                  {user.role === "admin" ? "Admin dashboard" : "Vendor workspace"}
                </Button>
              )}
              <Button type="button" variant="ghost" className="justify-center" onClick={() => void logout()}>
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          </>
        ) : (
          <LoadingRows rows={2} />
        )}
      </Panel>

      <Panel title="My bookings">
        {!bookings ? (
          <LoadingRows />
        ) : bookings.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <EmptyNote>No bookings yet.</EmptyNote>
            <Button href="/venues" variant="primary" withArrow>
              Explore venues
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {bookings.map((b) => (
              <li key={b.booking.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{b.event?.title ?? b.session.title}</p>
                  <p className="truncate text-xs text-mist">
                    {formatSessionTime(b.session.startsAt, b.session.endsAt)}
                    {b.venue ? ` · ${b.venue.name}` : ""}
                  </p>
                </div>
                {b.payment && <span className="text-sm text-white">{formatINR(b.payment.total)}</span>}
                <StatusBadge status={b.booking.state} />
                {b.booking.confirmationCode && (
                  <span className="font-mono text-[11px] text-zinc-500">{b.booking.confirmationCode}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
