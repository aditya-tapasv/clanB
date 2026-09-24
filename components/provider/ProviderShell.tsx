"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3, Boxes, CalendarDays, ClipboardList, LayoutDashboard, Megaphone, PlusCircle, UserCheck, Wallet, ArrowLeftRight, BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/Logo";
import { useProvider } from "./ProviderContext";

const NAV = [
  { href: "/provider", label: "Today", icon: LayoutDashboard },
  { href: "/provider/sessions", label: "Sessions", icon: CalendarDays },
  { href: "/provider/sessions/new", label: "New session", icon: PlusCircle },
  { href: "/provider/bookings", label: "Bookings", icon: ClipboardList },
  { href: "/provider/participants", label: "Check-in", icon: UserCheck },
  { href: "/provider/announcements", label: "Announcements", icon: Megaphone },
  { href: "/provider/inventory", label: "Inventory", icon: Boxes },
  { href: "/provider/payouts", label: "Payouts", icon: Wallet },
  { href: "/provider/insights", label: "Insights", icon: BarChart3 },
];

const TYPE_LABEL: Record<string, string> = {
  vendor: "Vendor",
  facilitator: "Facilitator",
  venue: "Venue",
  organizer: "Organizer",
  corporate: "Corporate",
  clanb: "Clan B Ops",
};

export function ProviderShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { orgId, org, orgs, setOrgId } = useProvider();

  // "/provider" and the two sessions entries match exactly; the rest also match sub-paths.
  const isActive = (href: string) =>
    href === "/provider" || href.startsWith("/provider/sessions") ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-ink text-[14px] text-white">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-white/10 bg-ink/95 px-4 backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
          <Logo height={20} />
          <span className="hidden rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-mist sm:inline">
            Provider workspace
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <label htmlFor="org-switcher" className="sr-only">
            Organization
          </label>
          <select
            id="org-switcher"
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            className="max-w-[46vw] truncate rounded-md border border-white/15 bg-ink-soft px-2 py-1.5 text-[13px] text-white focus:border-signal focus:outline-none"
          >
            {orgs.length === 0 && <option value={orgId}>Loading…</option>}
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
          <span
            className="hidden items-center gap-1 rounded-md border border-signal/30 bg-signal/10 px-2 py-1 text-[12px] text-signal md:inline-flex"
            title="You are acting as this organization"
          >
            {org?.verified && <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />}
            Acting as {org ? TYPE_LABEL[org.type] ?? org.type : "provider"} · Owner
          </span>
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-1.5 text-[12px] text-mist transition-colors duration-150 hover:text-white"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Player view</span>
          </Link>
        </div>
      </header>

      <div className="flex">
        <nav
          aria-label="Workspace"
          className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-52 shrink-0 overflow-y-auto border-r border-white/10 p-3 lg:block"
        >
          <ul className="space-y-0.5">
            {NAV.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors duration-150",
                    isActive(href) ? "bg-signal/10 text-signal" : "text-mist hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 flex-1">
          <nav aria-label="Workspace" className="overflow-x-auto border-b border-white/10 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
            <ul className="flex gap-1 px-3 py-2">
              {NAV.map(({ href, label }) => (
                <li key={href} className="shrink-0">
                  <Link
                    href={href}
                    aria-current={isActive(href) ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-2.5 py-1.5 text-[13px] transition-colors duration-150",
                      isActive(href) ? "bg-signal/10 text-signal" : "text-mist hover:text-white"
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <main id="main" className="mx-auto max-w-6xl p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
