"use client";

import React from "react";
import { Landmark } from "lucide-react";
import { formatDate, formatINR } from "@/lib/format";
import { useProviderData } from "./ProviderContext";
import { loadPayouts } from "./loaders";
import { ErrorNote, LoadingBlock, PageHeader, StatCard, StatusPill, TableScroll, tableClass, tdClass, thClass } from "./ui";

/** Weekly payouts (VEN-12, mock terms: base less discounts, minus 2% processing). */
export function PayoutsView() {
  const { data, loading, error, reload } = useProviderData(loadPayouts);
  const paid = data?.filter((p) => p.status === "paid") ?? [];
  const pending = data?.filter((p) => p.status !== "paid") ?? [];

  return (
    <>
      <PageHeader title="Payouts" description="Paid weekly to your bank account. Statements are itemised per booking." />
      {error && <ErrorNote message={error} onRetry={reload} />}
      {!data ? (
        loading && <LoadingBlock rows={6} />
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Pending" value={formatINR(pending.reduce((n, p) => n + p.net.amount, 0))} hint="Scheduled + processing" />
            <StatCard label="Paid (last 3 weeks)" value={formatINR(paid.reduce((n, p) => n + p.net.amount, 0))} />
            <StatCard label="Processing fees" value={formatINR(data.reduce((n, p) => n + p.fees.amount, 0))} hint="2% payment processing" />
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-panel px-4 py-3">
              <Landmark className="h-5 w-5 text-mist" aria-hidden="true" />
              <div>
                <p className="text-[12px] text-mist">Payout account</p>
                <p className="font-mono text-white">HDFC •••• 4821</p>
              </div>
            </div>
          </div>

          <TableScroll label="Payouts">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th scope="col" className={thClass}>Period</th>
                  <th scope="col" className={`${thClass} text-right`}>Bookings</th>
                  <th scope="col" className={`${thClass} text-right`}>Gross</th>
                  <th scope="col" className={`${thClass} text-right`}>Fees</th>
                  <th scope="col" className={`${thClass} text-right`}>Net</th>
                  <th scope="col" className={thClass}>Status</th>
                  <th scope="col" className={thClass}>Paid on</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p) => (
                  <tr key={p.id}>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {formatDate(p.periodStart)} – {formatDate(p.periodEnd)}
                    </td>
                    <td className={`${tdClass} text-right font-mono`}>{p.bookings}</td>
                    <td className={`${tdClass} text-right font-mono`}>{formatINR(p.gross)}</td>
                    <td className={`${tdClass} text-right font-mono text-mist`}>−{formatINR(p.fees)}</td>
                    <td className={`${tdClass} text-right font-mono text-white`}>{formatINR(p.net)}</td>
                    <td className={tdClass}>
                      <StatusPill status={p.status} />
                    </td>
                    <td className={`${tdClass} text-mist`}>{p.paidAt ? formatDate(p.paidAt) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroll>
          <p className="font-mono text-[11px] text-zinc-500">Demo data — commercial terms are confirmed during onboarding.</p>
        </div>
      )}
    </>
  );
}
