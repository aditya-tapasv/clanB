"use client";

import dynamic from "next/dynamic";
import type { ProviderTypeId } from "@/content/providers";

// Client-only so the saved draft can be read on first render without a hydration mismatch.
const ApplyWizard = dynamic(() => import("./ApplyWizard").then((m) => m.ApplyWizard), {
  ssr: false,
  loading: () => <div className="h-[480px] animate-pulse rounded-2xl bg-white/[0.03]" aria-busy="true" aria-label="Loading form" />,
});

export function ApplyWizardClient({ initialType }: { initialType?: ProviderTypeId }) {
  return <ApplyWizard initialType={initialType} />;
}
