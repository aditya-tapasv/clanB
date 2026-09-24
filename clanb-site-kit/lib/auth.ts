"use client";

/**
 * Mock auth (USR-01). Browse-first: nothing public is gated; checkout and My Clan B
 * ask for a session. Swap for the NestJS auth domain when the API lands.
 */
import { useSyncExternalStore } from "react";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

const STORAGE_KEY = "clanb.mock.session.v1";
const listeners = new Set<() => void>();
let cached: SessionUser | null | undefined;

function read(): SessionUser | null {
  if (cached !== undefined) return cached;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    const u = parsed as Partial<SessionUser> | null;
    cached = u && typeof u.id === "string" && typeof u.email === "string" && typeof u.name === "string" ? (u as SessionUser) : null;
  } catch {
    cached = null;
  }
  return cached;
}

function write(user: SessionUser | null) {
  cached = user;
  try {
    if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked: the session lasts for this page view only.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cached = undefined;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Stable user id derived from the email, so the same person sees the same bookings. */
function userIdFor(email: string): string {
  let h = 5381;
  for (const ch of email.toLowerCase()) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0;
  return `usr-${h.toString(36)}`;
}

export function signIn(input: { email: string; name?: string; phone?: string }): SessionUser {
  const email = input.email.trim().toLowerCase();
  const user: SessionUser = {
    id: userIdFor(email),
    email,
    name: input.name?.trim() || email.split("@")[0],
    phone: input.phone?.trim() || undefined,
  };
  write(user);
  return user;
}

export function updateProfile(patch: Partial<Pick<SessionUser, "name" | "phone">>) {
  const current = read();
  if (current) write({ ...current, ...patch });
}

export function signOut() {
  write(null);
}

export type SessionState = { status: "loading" } | { status: "signed-out" } | { status: "signed-in"; user: SessionUser };

const LOADING: SessionState = { status: "loading" };
const SIGNED_OUT: SessionState = { status: "signed-out" };
let lastUser: SessionUser | null = null;
let lastState: SessionState = SIGNED_OUT;

function snapshot(): SessionState {
  const user = read();
  if (user !== lastUser) {
    lastUser = user;
    lastState = user ? { status: "signed-in", user } : SIGNED_OUT;
  }
  return lastState;
}

/** "loading" during SSR and hydration, then the real session. */
export function useSession(): SessionState {
  return useSyncExternalStore(subscribe, snapshot, () => LOADING);
}

/** Only allow same-site relative redirects after sign-in. */
export function safeNext(next: string | undefined | null, fallback = "/me"): string {
  const ok = next && next.startsWith("/") && !next.startsWith("//") && !/^\/(login|signup)\b/.test(next);
  return ok ? next : fallback;
}
