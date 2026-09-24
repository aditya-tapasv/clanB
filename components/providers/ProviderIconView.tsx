import {
  BarChart3, Building2, CalendarPlus, ClipboardCheck, Clock, Handshake, LayoutGrid, ListOrdered,
  MessageSquare, PartyPopper, QrCode, ShieldCheck, Sparkles, Trophy, Users, Wallet,
} from "lucide-react";
import type { ProviderIcon } from "@/content/providers";

const ICONS = {
  BarChart3, Building2, CalendarPlus, ClipboardCheck, Clock, Handshake, LayoutGrid, ListOrdered,
  MessageSquare, PartyPopper, QrCode, ShieldCheck, Sparkles, Trophy, Users, Wallet,
} satisfies Record<ProviderIcon, unknown>;

export function ProviderIconView({ icon, className }: { icon: ProviderIcon; className?: string }) {
  const Icon = ICONS[icon];
  return <Icon className={className} aria-hidden="true" />;
}
