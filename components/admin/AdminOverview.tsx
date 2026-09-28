"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DashboardHeading, LoadingRows, Panel, StatCard } from "@/components/dashboard/ui";
import { useSession } from "@/components/auth/SessionProvider";
import { getAdminStats } from "@/lib/api/admin";
import type { AdminStats } from "@/lib/api/types";

const QUEUES: { href: string; label: string; key: keyof AdminStats; hint: string }[] = [
  { href: "/admin/vendors", label: "Vendor applications", key: "pendingVendors", hint: "waiting for review" },
  { href: "/admin/partners", label: "Partner enquiries", key: "newPartnerEnquiries", hint: "new" },
  { href: "/admin/venue-listings", label: "Venue listings", key: "pendingVenueListings", hint: "waiting for review" },
  { href: "/admin/queries", label: "Contact queries", key: "openQueries", hint: "open" },
];

export function AdminOverview() {
  const { user } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    void getAdminStats().then(setStats);
  }, []);

  const waiting = stats ? QUEUES.reduce((n, q) => n + stats[q.key], 0) : null;

  return (
    <>
      <DashboardHeading
        eyebrow="Admin"
        title={`Welcome back${user ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="Everything that came in through the website, in one place."
      />

      {!stats ? (
        <Panel>
          <LoadingRows rows={3} />
        </Panel>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Needs attention" value={waiting} hint="across all queues" accent />
            <StatCard label="Pending vendors" value={stats.pendingVendors} />
            <StatCard label="Open queries" value={stats.openQueries} />
            <StatCard label="Users" value={stats.totalUsers} />
          </div>

          <Panel title="Queues" className="mt-8">
            <ul className="divide-y divide-white/10">
              {QUEUES.map((q) => (
                <li key={q.href}>
                  <Link href={q.href} className="group flex items-center justify-between px-5 py-4 transition hover:bg-white/[0.03]">
                    <span className="text-sm font-medium text-white group-hover:text-signal">{q.label}</span>
                    <span className="flex items-center gap-3 text-sm text-mist">
                      <span>
                        <span className="font-semibold text-white">{stats[q.key]}</span> {q.hint}
                      </span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        </>
      )}
    </>
  );
}
