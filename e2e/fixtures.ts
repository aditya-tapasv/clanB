import { test as base, expect } from "@playwright/test";

/**
 * Known third-party noise, not fixable in our code:
 * - @react-three/fiber 9 constructs THREE.Clock internally, which three r18x marks deprecated.
 */
const ALLOWED = [/THREE\.Clock: This module has been deprecated/];

/** Every test fails on browser console errors/warnings or uncaught page errors (§15). */
const test = base.extend<{ consoleGuard: void }>({
  consoleGuard: [
    async ({ page }, use) => {
      const problems: string[] = [];
      page.on("console", (msg) => {
        if ((msg.type() === "error" || msg.type() === "warning") && !ALLOWED.some((re) => re.test(msg.text()))) {
          problems.push(`[${msg.type()}] ${msg.text()}`);
        }
      });
      page.on("pageerror", (err) => problems.push(`[pageerror] ${err.message}`));
      await use();
      // The 404 page's own document request is expected to log a 404.
      if (test.info().title.includes("404")) problems.splice(0, problems.length, ...problems.filter((p) => !p.includes("status of 404")));
      expect(problems, "console must stay clean").toEqual([]);
    },
    { auto: true },
  ],
});

export { test, expect };

export const isMobile = (projectName: string) => projectName.includes("mobile");
