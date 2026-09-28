/**
 * Signed session cookie (HS256 JWT via `jose`). Used only on the server: the proxy and the
 * `/api/auth/*` route handlers. The cookie is httpOnly, so browser JavaScript never sees it.
 *
 * The payload holds the user's public profile + role, and (once the NestJS backend is live)
 * the backend access token, which `/api/backend/*` forwards as `Authorization: Bearer …`.
 */
import { SignJWT, jwtVerify } from "jose";
import { isRole, type SessionUser } from "./roles";

export const SESSION_COOKIE = "clanb_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  user: SessionUser;
  /** NestJS access token (absent in mock mode). */
  accessToken?: string;
}

const DEV_SECRET = "clanb-dev-only-session-secret-change-me-0123456789";

/** SESSION_SECRET is required in production; development falls back to a fixed dev secret. */
function secretKey(): Uint8Array | null {
  const secret = process.env.SESSION_SECRET ?? (process.env.NODE_ENV === "production" ? undefined : DEV_SECRET);
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export function authConfigured(): boolean {
  return secretKey() !== null;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const key = secretKey();
  if (!key) throw new Error("SESSION_SECRET is not set (32+ characters required).");
  return new SignJWT({ user: payload.user, at: payload.accessToken })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(key);
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  const key = secretKey();
  if (!token || !key) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    const user = payload.user as SessionUser | undefined;
    if (!user || typeof user.id !== "string" || typeof user.name !== "string" || !isRole(user.role)) return null;
    return { user, accessToken: typeof payload.at === "string" ? payload.at : undefined };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
