import { test, expect } from "./fixtures";

// FRD §26.1 #11 — with reduced motion: content is fully visible without scroll theatrics.
test.use({ reducedMotion: "reduce" });

const PAGES = ["/", "/sports", "/games", "/about", "/for-providers"];

for (const path of PAGES) {
  test(`reduced motion ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const report = await page.evaluate(() => {
      const hidden: string[] = [];
      for (const el of document.querySelectorAll<HTMLElement>("main h1, main h2, main p, main a")) {
        const cs = getComputedStyle(el);
        if (el.getClientRects().length && (Number(cs.opacity) < 0.99 || cs.filter.includes("blur"))) {
          hidden.push(`${el.tagName} "${(el.textContent ?? "").trim().slice(0, 30)}" opacity=${cs.opacity}`);
        }
      }
      const running = document
        .getAnimations()
        .filter((a) => a.playState === "running" && a instanceof CSSAnimation && !["ping", "pulse", "spin"].includes(a.animationName));
      return {
        hidden: hidden.slice(0, 5),
        marquees: running.map((a) => (a as CSSAnimation).animationName),
        lenis: document.documentElement.classList.contains("lenis"),
        dip: !!document.querySelector("[data-dip-overlay]"),
      };
    });

    expect(report.hidden, "text must render at its final state").toEqual([]);
    expect(report.marquees, "marquees stop").toEqual([]);
    expect(report.lenis, "no Lenis").toBe(false);
    expect(report.dip, "no dip overlay").toBe(false);
  });
}
