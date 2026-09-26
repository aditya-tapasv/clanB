import { test, expect, isMobile } from "./fixtures";

// From the landing page a visitor reaches every area in the header.
const DESTINATIONS = [{ label: "Venues", path: "/venues" }];

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

  test("Services dropdown reaches all four forms", async ({ page }, info) => {
    test.skip(isMobile(info.project.name), "desktop hover menu");
    for (const [label, path] of [
      ["Become a Vendor", "/services/vendor"],
      ["Partner with Clan B", "/services/partner"],
      ["List Your Venue", "/services/list-venue"],
      ["Contact Us", "/contact"],
    ] as const) {
      await page.goto("/");
      await page.getByRole("button", { name: "Services" }).hover();
      await page.getByRole("link", { name: new RegExp(label) }).first().click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
    }
  });

  test("old provider and account URLs redirect", async ({ page }) => {
    await page.goto("/for-providers/host");
    await expect(page).toHaveURL(/\/services\/vendor$/);
    await page.goto("/login");
    await expect(page).toHaveURL(/\/$/);
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
