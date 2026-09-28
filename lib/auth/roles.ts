/**
 * Roles and route access rules. Shared by the proxy (server), the auth route handlers and
 * the client UI. The frontend only *routes* by role — the NestJS backend (guards + database
 * row-level security) is what actually protects data. See docs/AUTH_RBAC.md.
 */

export type Role = "admin" | "vendor" | "user";

export interface SessionUser {
  id: string;
  name: string;
  role: Role;
  email?: string;
  phone?: string;
}

/** Where each role lands after logging in. */
export const ROLE_HOME: Record<Role, string> = {
  admin: "/admin",
  vendor: "/vendor",
  user: "/account",
};

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  vendor: "Vendor",
  user: "Player",
};

/** Route prefixes that need a session, and the roles allowed on each. */
const PROTECTED: { prefix: string; roles: Role[] }[] = [
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/vendor", roles: ["vendor", "admin"] },
  { prefix: "/account", roles: ["user", "vendor", "admin"] },
];

function matches(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/** Roles allowed on a path, or null when the path is public. */
export function rolesFor(pathname: string): Role[] | null {
  return PROTECTED.find((rule) => matches(pathname, rule.prefix))?.roles ?? null;
}

export function canAccess(role: Role, pathname: string): boolean {
  const roles = rolesFor(pathname);
  return roles === null || roles.includes(role);
}

/**
 * Post-login destination: the requested `next` path when it is a same-site path the role may
 * open, otherwise the role's home. Guards against open redirects (`//evil.com`, `https://…`).
 */
export function destinationFor(role: Role, next?: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/login") && canAccess(role, next)) {
    return next;
  }
  return ROLE_HOME[role];
}

export function isRole(value: unknown): value is Role {
  return value === "admin" || value === "vendor" || value === "user";
}
