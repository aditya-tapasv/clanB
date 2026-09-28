import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/token";

/** GET /api/auth/session — the signed-in user (public profile + role), or null. */
export async function GET() {
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  return NextResponse.json({ user: session?.user ?? null }, { headers: { "Cache-Control": "no-store" } });
}
