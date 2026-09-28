import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = { title: "Vendor workspace | Clan B", robots: { index: false, follow: false } };

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell section="vendor">{children}</DashboardShell>;
}
