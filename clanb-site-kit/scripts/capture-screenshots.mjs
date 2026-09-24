// Captures docs/screenshots (desktop 1440 + mobile 375) and a short booking-flow recording.
// Usage: pnpm build && pnpm start -p 3100 (in another terminal), then: node scripts/capture-screenshots.mjs
import { chromium } from "@playwright/test";
import { mkdir, rename, readdir } from "node:fs/promises";
import { join } from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const OUT = "docs/screenshots";
const PAGES = [
  ["home", "/"],
  ["play", "/play"],
  ["event", "/events/friday-catan-social-kora"],
  ["venue", "/venues/smash-hub-indiranagar"],
  ["sports", "/sports"],
  ["games", "/games"],
  ["for-providers", "/for-providers"],
  ["provider-today", "/provider"],
  ["provider-insights", "/provider/insights"],
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });

for (const [label, width, height, mobile] of [["desktop", 1440, 900, false], ["mobile", 375, 812, true]]) {
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const [name, path] of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({ path: join(OUT, `${name}-${label}.png`), fullPage: !path.startsWith("/provider") });
    console.log("captured", name, label);
  }
  await ctx.close();
}

// Booking flow recording (~20 s).
const videoDir = join(OUT, "_video");
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: videoDir, size: { width: 1280, height: 800 } } });
const page = await ctx.newPage();
await page.goto(`${BASE}/events/friday-catan-social-kora`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.goto(`${BASE}/checkout/evt-001?quantity=2`, { waitUntil: "networkidle" });
await page.getByRole("checkbox").check();
await page.getByRole("button", { name: /Hold 2 seats/ }).click();
await page.getByLabel("Email address").fill("demo@clanb.in");
await page.getByRole("button", { name: "Send code" }).click();
await page.getByLabel("Verification code").fill("123456");
await page.getByRole("button", { name: "Sign in" }).click();
await page.getByRole("timer").waitFor();
await page.waitForTimeout(1000);
await page.getByLabel("Promo code").fill("FIRSTGAME");
await page.getByRole("button", { name: "Apply" }).click();
await page.getByText("Code applied.").waitFor();
await page.getByRole("button", { name: /^Pay / }).click();
await page.getByRole("heading", { name: "You're booked!" }).waitFor();
await page.waitForTimeout(2000);
await page.getByRole("link", { name: "View in My Clan B" }).click();
await page.waitForTimeout(2500);
await ctx.close();
const [video] = await readdir(videoDir);
await rename(join(videoDir, video), join(OUT, "booking-flow.webm"));
console.log("recorded booking-flow.webm");

await browser.close();
