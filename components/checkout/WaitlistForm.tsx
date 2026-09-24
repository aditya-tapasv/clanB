"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";
import { useSession } from "@/lib/auth";
import { isBookingError, repo } from "@/lib/data/repo";

/** Join a session's waitlist (USR-09); position comes from the repo. */
export function WaitlistForm({ sessionId }: { sessionId: string }) {
  const session = useSession();
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const value = email || (session.status === "signed-in" ? session.user.email : "");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await repo.joinWaitlist(sessionId, value.trim());
      track("waitlist_join", { eventId: sessionId });
      setPosition(res.position);
    } catch (err) {
      setError(isBookingError(err) ? err.message : "Couldn't join the waitlist. Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (position !== null) {
    return (
      <p role="status" className="flex items-center gap-2 rounded-lg border border-signal/30 bg-signal/10 p-3 text-xs text-signal">
        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        You&apos;re #{position} on the waitlist. We&apos;ll email {value} if a seat opens up.
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <label htmlFor={`waitlist-${sessionId}`} className="sr-only">
        Email for seat alerts
      </label>
      <input
        id={`waitlist-${sessionId}`}
        type="email"
        autoComplete="email"
        value={value}
        onChange={(e) => {
          setEmail(e.target.value);
          setError(null);
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `waitlist-${sessionId}-error` : undefined}
        placeholder="Enter email for seat alerts"
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/60 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
      />
      {error && (
        <p id={`waitlist-${sessionId}-error`} role="alert" className="text-xs text-rose-400">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-400 bg-amber-400 px-4 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-amber-300 disabled:opacity-60"
      >
        {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
        Join waitlist
      </button>
    </form>
  );
}
