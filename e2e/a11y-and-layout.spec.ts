import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures";

// One representative page per template keeps the run short; the link crawl covers every URL.
const PAGES = [
  "/", "/events/friday-catan-social-kora", "/venues/smash-hub-indiranagar", "/sports/badminton", "/games",
  "/help/report", "/for-providers", "/for-providers/apply", "/checkout/evt-001", "/provider/sessions/new",
];

// FRD §22 / T-902 acceptance — axe: zero critical violations. Measured with reduced motion so
// scroll-reveal animations sit at their final state (otherwise axe samples mid-fade colours).
test.describe("accessibility", () => {
  test.use({ reducedMotion: "reduce" });
  for (const path of PAGES) {
    test(`axe ${path}`, async ({ page }, info) => {
      test.skip(info.project.name !== "chrome-desktop", "axe runs once, on desktop Chrome");
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      const blocking = results.violations
        .filter((v) => v.impact === "critical")
        .map((v) => `${v.impact} ${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(", ")}`);
      expect(blocking).toEqual([]);
    });
  }
});

// §11 / T-907 — no horizontal overflow on phones.
test.describe("mobile layout", () => {
  for (const width of [375, 414]) {
    for (const path of PAGES) {
      test(`${width}px ${path}`, async ({ page }, info) => {
        test.skip(info.project.name !== "chrome-mobile", "mobile project only");
        await page.setViewportSize({ width, height: 812 });
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  }
});
