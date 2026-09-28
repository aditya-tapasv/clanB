import { NextResponse } from "next/server";
import { AuthError, verifyOtp } from "@/lib/auth/backend";
import { destinationFor } from "@/lib/auth/roles";
import { authConfigured, SESSION_COOKIE, sessionCookieOptions, signSession } from "@/lib/auth/token";
import { normaliseIdentifier } from "@/lib/validators";

/**
 * POST /api/auth/otp/verify — checks the code with the backend, then stores the session in an
 * httpOnly cookie and tells the client where this role should land.
 */
export async function POST(request: Request) {
  if (!authConfigured()) {
    return NextResponse.json({ message: "Login isn't configured yet (SESSION_SECRET missing)." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const channel = body?.channel === "email" ? "email" : body?.channel === "phone" ? "phone" : null;
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : undefined;
  const next = typeof body?.next === "string" ? body.next : null;
  const identifier =
    channel && typeof body?.identifier === "string" ? normaliseIdentifier(channel, body.identifier) : null;

  if (!channel || !identifier || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ message: "Enter the 6-digit code." }, { status: 400 });
  }

  try {
    const { user, accessToken } = await verifyOtp({ channel, identifier, code, name });
    const response = NextResponse.json({ user, redirectTo: destinationFor(user.role, next) });
    response.cookies.set(SESSION_COOKIE, await signSession({ user, accessToken }), sessionCookieOptions);
    return response;
  } catch (err) {
    const status = err instanceof AuthError ? err.status : 502;
    const message = err instanceof AuthError ? err.message : "Couldn't verify the code. Please try again.";
    return NextResponse.json({ message }, { status });
  }
}
