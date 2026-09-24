import { test, expect } from "./fixtures";

// §12.5 budgets (local production build; network throttling not applied): LCP < 2.5 s, CLS < 0.05.
for (const path of ["/", "/events", "/games", "/venues/smash-hub-indiranagar"]) {
  test(`perf budget ${path}`, async ({ page }, info) => {
    test.skip(info.project.name === "edge-desktop", "Chrome projects cover this");
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(800);
    const m = await page.evaluate(
      () =>
        new Promise<{ lcp: number; cls: number }>((resolve) => {
          let lcp = 0;
          let cls = 0;
          new PerformanceObserver((l) => l.getEntries().forEach((e) => (lcp = Math.max(lcp, e.startTime)))).observe({ type: "largest-contentful-paint", buffered: true });
          new PerformanceObserver((l) =>
            l.getEntries().forEach((e) => {
              const s = e as PerformanceEntry & { value: number; hadRecentInput: boolean };
              if (!s.hadRecentInput) cls += s.value;
            })
          ).observe({ type: "layout-shift", buffered: true });
          setTimeout(() => resolve({ lcp, cls }), 300);
        })
    );
    console.log(`${info.project.name} ${path} LCP=${Math.round(m.lcp)}ms CLS=${m.cls.toFixed(3)}`);
    expect(m.lcp).toBeLessThan(2500);
    expect(m.cls).toBeLessThan(0.05);
  });
}
