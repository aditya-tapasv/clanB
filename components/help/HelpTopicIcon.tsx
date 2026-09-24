import { CalendarCheck, Flag, RotateCcw, ShieldCheck } from "lucide-react";
import type { HelpTopic } from "@/content/help";

const ICONS = { CalendarCheck, Flag, RotateCcw, ShieldCheck } satisfies Record<HelpTopic["icon"], unknown>;

export function HelpTopicIcon({ icon, className }: { icon: HelpTopic["icon"]; className?: string }) {
  const Icon = ICONS[icon];
  return <Icon className={className} aria-hidden="true" />;
}
