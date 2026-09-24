import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Clan B — the future of games";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Site-wide share image: the Clan B logo on ink with the lime wash (§12.6). */
export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/clanb-logo.svg"), "base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "radial-gradient(ellipse at 20% 0%, rgba(92,241,17,0.28), transparent 55%), #030706",
          color: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
        <img src={`data:image/svg+xml;base64,${logo}`} width={420} height={126} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>The future of games.</div>
          <div style={{ fontSize: 32, color: "#A8A29E" }}>
            Play, host and run board games and sports — in one place.
          </div>
        </div>
      </div>
    ),
    size
  );
}
