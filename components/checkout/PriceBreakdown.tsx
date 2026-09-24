import React from "react";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import type { Payment } from "@/lib/data/types";

/** Itemised price lines exactly as returned by the repo (USR-06). */
export function PriceBreakdown({ payment, className }: { payment: Payment; className?: string }) {
  return (
    <dl className={cn("space-y-2 text-sm", className)}>
      {payment.lines.map((line) => {
        const isTotal = line.type === "total";
        return (
          <div
            key={`${line.type}-${line.label}`}
            className={cn(
              "flex items-start justify-between gap-4",
              isTotal && "mt-3 border-t border-white/10 pt-3 text-base font-semibold text-white"
            )}
          >
            <dt className={cn(!isTotal && "text-mist", line.type === "discount" && "text-signal")}>{line.label}</dt>
            <dd className={cn("shrink-0 font-mono", line.type === "discount" ? "text-signal" : "text-white")}>
              {formatINR(line.amount)}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
