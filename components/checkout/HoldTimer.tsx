"use client";

import React, { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { cn } from "@/lib/cn";

export interface HoldTimerProps {
  heldUntil: string;
  onExpire: () => void;
}

/** Countdown to the repo-issued `heldUntil` (FRD 15.1). */
export function HoldTimer({ heldUntil, onExpire }: HoldTimerProps) {
  const deadline = Date.parse(heldUntil);
  const [remaining, setRemaining] = useState(() => Math.max(0, deadline - Date.now()));

  useEffect(() => {
    const id = window.setInterval(() => {
      const left = Math.max(0, deadline - Date.now());
      setRemaining(left);
      if (left === 0) {
        window.clearInterval(id);
        onExpire();
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [deadline, onExpire]);

  const totalSeconds = Math.ceil(remaining / 1000);
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  const urgent = totalSeconds <= 60;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border px-4 py-3",
        urgent ? "border-amber-500/40 bg-amber-500/10" : "border-signal/30 bg-signal/5"
      )}
    >
      <span className="flex items-center gap-2 text-sm text-white">
        <Timer className={cn("h-4 w-4", urgent ? "text-amber-400" : "text-signal")} aria-hidden="true" />
        Seats held for you
      </span>
      <span
        role="timer"
        aria-label={`${mm} minutes ${ss} seconds left on your hold`}
        className={cn("font-mono text-lg font-semibold tabular-nums", urgent ? "text-amber-400" : "text-signal")}
      >
        {mm}:{ss}
      </span>
    </div>
  );
}
