import { NextResponse, type NextRequest } from "next/server";
import { ROLE_HOME, rolesFor } from "@/lib/auth/roles";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/token";

/**
 * Role-based routing (runs before the page renders):
 *  - /admin/*   → admin only
 *  - /vendor/*  → vendors (and admins)
 *  - /account/* → any signed-in user
 *  - /login     → signed-in users are sent to their own home
 * Wrong role → that role's home. No session → /login?next=<path>.
 * This is navigation only; the NestJS backend enforces access to the data itself.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/login") {
    return session ? NextResponse.redirect(new URL(ROLE_HOME[session.user.role], request.url)) : NextResponse.next();
  }

  const roles = rolesFor(pathname);
  if (!roles) return NextResponse.next();

  if (!session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  if (!roles.includes(session.user.role)) {
    return NextResponse.redirect(new URL(ROLE_HOME[session.user.role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/vendor/:path*", "/account/:path*"],
};
