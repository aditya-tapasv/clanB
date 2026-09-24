import { test, expect, isMobile } from "./fixtures";

// FRD §26.1 #1 — from the landing page a visitor reaches every major area.
const DESTINATIONS = [
  { label: "Play", path: "/play" },
  { label: "Events", path: "/events" },
  { label: "Sports", path: "/sports" },
  { label: "Games", path: "/games" },
];

test.describe("landing navigation", () => {
  for (const d of DESTINATIONS) {
    test(`reaches ${d.label}`, async ({ page }, info) => {
      await page.goto("/");
      if (isMobile(info.project.name)) {
        await page.getByRole("button", { name: "Open menu" }).click();
        await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: d.label, exact: true }).click();
      } else {
        await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: d.label, exact: true }).click();
      }
      await expect(page).toHaveURL(new RegExp(`${d.path}$`));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }

  test("reaches For Providers and the apply wizard", async ({ page }) => {
    await page.goto("/for-providers");
    await page.getByRole("link", { name: "Apply to host" }).first().click();
    await expect(page).toHaveURL(/\/for-providers\/apply/);
    await expect(page.getByRole("heading", { name: "Organisation" })).toBeVisible();
  });

  test("unknown URLs show the branded 404", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "This tile is missing" })).toBeVisible();
  });

  test("client-side navigation across routes stays clean (no ScrollTrigger/Lenis leaks)", async ({ page }, info) => {
    test.skip(isMobile(info.project.name), "desktop nav covers the route-change path");
    await page.goto("/");
    for (const d of [...DESTINATIONS, { label: "Venues", path: "/venues" }]) {
      await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: d.label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${d.path}$`));
      await page.mouse.wheel(0, 1600);
      await page.goBack();
      await page.mouse.wheel(0, 800);
    }
    // After many route changes the document must still scroll and render the hero heading.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
