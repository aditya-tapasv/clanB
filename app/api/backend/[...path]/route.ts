import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/config";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/token";

/**
 * Authenticated pass-through to the NestJS API: /api/backend/<path> → API_BASE_URL/<path>,
 * with the signed-in user's backend token as `Authorization: Bearer …`. The browser never
 * holds that token. Used by admin/vendor/account calls once the real API is switched on.
 */
async function forward(request: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ message: "Please log in again." }, { status: 401 });
  if (!session.accessToken) {
    return NextResponse.json({ message: "Backend not connected yet (mock mode)." }, { status: 503 });
  }

  const { path } = await ctx.params;
  const url = new URL(request.url);
  const target = `${API_BASE_URL}/${path.map(encodeURIComponent).join("/")}${url.search}`;
  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  const upstream = await fetch(target, {
    method: request.method,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.accessToken}`,
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
    },
    body: hasBody ? await request.text() : undefined,
    cache: "no-store",
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
  });
}

export { forward as GET, forward as POST, forward as PATCH, forward as PUT, forward as DELETE };
