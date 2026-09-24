"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";

/** Check-in QR (USR-10). Encodes the booking reference hosts scan at the door. */
export function BookingQr({ bookingId, code, size = 148 }: { bookingId: string; code: string; size?: number }) {
  return (
    <figure className="inline-flex flex-col items-center gap-2">
      <div className="rounded-xl bg-white p-3">
        <QRCodeSVG value={`clanb:booking:${bookingId}:${code}`} size={size} level="M" title={`Check-in code ${code}`} />
      </div>
      <figcaption className="font-mono text-xs tracking-wider text-white">{code}</figcaption>
    </figure>
  );
}
