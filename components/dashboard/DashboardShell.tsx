"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Handshake,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Ticket,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useSession } from "@/components/auth/SessionProvider";
import { initials } from "@/components/auth/AccountMenu";
import { ROLE_LABEL } from "@/lib/auth/roles";
import { cn } from "@/lib/cn";

type Section = "admin" | "vendor";

const NAV: Record<Section, { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[]> = {
  admin: [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/vendors", label: "Vendor applications", icon: UserCog },
    { href: "/admin/partners", label: "Partner enquiries", icon: Handshake },
    { href: "/admin/venue-listings", label: "Venue listings", icon: Building2 },
    { href: "/admin/queries", label: "Contact queries", icon: MessageSquare },
    { href: "/admin/users", label: "Users & roles", icon: Users },
  ],
  vendor: [
    { href: "/vendor", label: "Overview", icon: LayoutDashboard },
    { href: "/vendor/sessions", label: "Sessions", icon: CalendarDays },
    { href: "/vendor/bookings", label: "Bookings & check-in", icon: Ticket },
  ],
};

/** App shell for the signed-in workspaces: fixed top bar + sidebar, same ink/lime theme as the site. */
export function DashboardShell({ section, children }: { section: Section; children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useSession();
  const [navOpen, setNavOpen] = useState(false);

  const nav = NAV[section];
  const isActive = (href: string) => (href === `/${section}` ? pathname === href : pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-ink">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-ink/85 px-4 backdrop-blur-xl lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setNavOpen((v) => !v)}
            aria-label={navOpen ? "Close navigation" : "Open navigation"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white lg:hidden"
          >
            {navOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <Logo height={20} />
          <span className="rounded-full border border-signal/30 bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-signal">
            {section === "admin" ? "Admin" : "Vendor"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden items-center gap-2.5 sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-signal font-mono text-[11px] font-bold text-ink">
                {initials(user.name)}
              </span>
              <div className="leading-tight">
                <p className="max-w-[12rem] truncate text-sm font-medium text-white">{user.name}</p>
                <p className="text-[11px] text-zinc-500">{ROLE_LABEL[user.role]}</p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => void logout()}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-mist transition hover:border-white/30 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Log out
          </button>
        </div>
      </header>

      <aside
        className={cn(
          "fixed bottom-0 left-0 top-16 z-30 flex w-64 flex-col border-r border-white/10 bg-panel/95 p-4 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
          navOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav aria-label={section === "admin" ? "Admin" : "Vendor"} className="flex flex-col gap-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setNavOpen(false)}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                isActive(href)
                  ? "border border-signal/25 bg-signal/10 font-medium text-signal"
                  : "border border-transparent text-mist hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-4">
          <Link href="/" className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-mist hover:bg-white/5 hover:text-white">
            Back to site
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <p className="mt-3 px-3 text-[11px] italic text-zinc-600">
            The future of <span className="text-signal/70">games.</span>
          </p>
        </div>
      </aside>

      {navOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 top-16 z-20 bg-ink/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <main id="main" className="relative pt-16 lg:pl-64">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
