import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface LeadSuccessProps {
  heading: string;
  body: string;
  reference: string;
  onReset: () => void;
  resetLabel: string;
}

/** Shared "thanks, we got it" state for every lead form. */
export function LeadSuccess({ heading, body, reference, onReset, resetLabel }: LeadSuccessProps) {
  return (
    <div role="status" className="space-y-4 rounded-2xl border border-signal/30 bg-panel p-8 text-center">
      <CheckCircle2 className="mx-auto h-10 w-10 text-signal" aria-hidden="true" />
      <h2 className="font-display text-2xl font-semibold text-white">{heading}</h2>
      <p className="text-sm leading-relaxed text-mist">{body}</p>
      <p className="font-mono text-xs text-zinc-500">
        Reference <span className="text-signal">{reference}</span>
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onReset}>
          {resetLabel}
        </Button>
        <Button href="/for-providers" variant="signal-ghost">
          Back to For Providers
        </Button>
      </div>
    </div>
  );
}
