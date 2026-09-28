/**
 * OTP auth against the NestJS `AuthModule` — server-side only (called from /api/auth/*).
 *
 *   POST /auth/otp/request  { channel, identifier, purpose, name? } → { sent, resendInSec }
 *   POST /auth/otp/verify   { channel, identifier, code, name? }    → { accessToken, user }
 *
 * The backend decides the role (admin / vendor / user) — never the browser. Each function has
 * the real call commented out and a mock below it. Contract: docs/AUTH_RBAC.md.
 */
import "server-only";
// import { API_BASE_URL } from "@/lib/api/config";
import type { Role, SessionUser } from "./roles";

import type { OtpChannel } from "./types";
export type { OtpChannel };

export interface OtpRequestInput {
  channel: OtpChannel;
  identifier: string;
  purpose: "login" | "register";
  name?: string;
}

export interface OtpVerifyInput {
  channel: OtpChannel;
  identifier: string;
  code: string;
  name?: string;
}

export interface OtpRequestResult {
  sent: true;
  resendInSec: number;
  /** Mock mode in development only: the code to type, so the flow can be tried locally. */
  devCode?: string;
}

export interface OtpVerifyResult {
  user: SessionUser;
  accessToken?: string;
}

export class AuthError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "AuthError";
  }
}

// ── Real API helper (uncomment with the blocks below) ─────────────────────────
// async function post<T>(path: string, body: unknown): Promise<T> {
//   const res = await fetch(`${API_BASE_URL}${path}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", Accept: "application/json" },
//     body: JSON.stringify(body),
//     cache: "no-store",
//   });
//   const data = (await res.json().catch(() => ({}))) as { message?: string | string[] } & T;
//   if (!res.ok) {
//     const msg = Array.isArray(data.message) ? data.message.join(" ") : data.message;
//     throw new AuthError(res.status, msg ?? "Something went wrong. Please try again.");
//   }
//   return data;
// }

export async function requestOtp(input: OtpRequestInput): Promise<OtpRequestResult> {
  // ── Real API ────────────────────────────────────────────────────────────────
  // return post<OtpRequestResult>("/auth/otp/request", input);

  // ── Dummy data (current) ────────────────────────────────────────────────────
  void input;
  return {
    sent: true,
    resendInSec: 30,
    devCode: process.env.NODE_ENV === "development" ? mockCode() : undefined,
  };
}

export async function verifyOtp(input: OtpVerifyInput): Promise<OtpVerifyResult> {
  // ── Real API ────────────────────────────────────────────────────────────────
  // return post<OtpVerifyResult>("/auth/otp/verify", input);

  // ── Dummy data (current) ────────────────────────────────────────────────────
  if (input.code !== mockCode()) {
    throw new AuthError(401, "That code isn't right. Check it and try again.");
  }
  const identifier = input.identifier.toLowerCase();
  const role = mockRoleFor(identifier);
  return {
    user: {
      id: `usr_${hash(identifier)}`,
      name: input.name?.trim() || defaultName(identifier, role),
      role,
      ...(input.channel === "email" ? { email: identifier } : { phone: identifier }),
    },
  };
}

// ── Mock helpers ──────────────────────────────────────────────────────────────

function mockCode() {
  return process.env.MOCK_OTP_CODE ?? "123456";
}

function list(value: string | undefined, fallback: string) {
  return (value ?? fallback)
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Mock role lookup. Admin e-mails and vendor e-mails/phones come from server-only env vars
 * (defaults: admin@clanb.in / vendor@clanb.in). With the real backend, the role comes from
 * the users table instead.
 */
function mockRoleFor(identifier: string): Role {
  if (list(process.env.ADMIN_EMAILS, "admin@clanb.in").includes(identifier)) return "admin";
  if (list(process.env.VENDOR_IDENTIFIERS, "vendor@clanb.in").includes(identifier)) return "vendor";
  return "user";
}

function defaultName(identifier: string, role: Role) {
  if (role === "admin") return "Admin";
  const local = identifier.includes("@") ? identifier.split("@")[0] : `Player ${identifier.slice(-4)}`;
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}
