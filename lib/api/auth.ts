/**
 * Browser-side auth calls. These always go to the Next.js route handlers in app/api/auth/*,
 * which talk to NestJS (or the mock) on the server and manage the httpOnly session cookie.
 */
import type { SessionUser } from "@/lib/auth/roles";
import type { OtpChannel } from "@/lib/auth/types";

async function call<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api/auth${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as T & { message?: string };
  if (!res.ok) throw new Error(data.message ?? "Something went wrong. Please try again.");
  return data;
}

export function sendOtp(input: { channel: OtpChannel; identifier: string; purpose: "login" | "register"; name?: string }) {
  return call<{ sent: true; resendInSec: number; devCode?: string }>("/otp/request", input);
}

export function confirmOtp(input: { channel: OtpChannel; identifier: string; code: string; name?: string; next?: string | null }) {
  return call<{ user: SessionUser; redirectTo: string }>("/otp/verify", input);
}

export function fetchSession() {
  return call<{ user: SessionUser | null }>("/session");
}

export function logout() {
  return call<{ ok: true }>("/logout", {});
}
