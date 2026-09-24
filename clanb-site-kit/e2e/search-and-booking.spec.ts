import { test, expect } from "./fixtures";

// FRD §26.1 #2 — search finds an event; #4 — mock booking end to end (UI level).

test("search page finds an event and opens it", async ({ page }) => {
  await page.goto("/search?q=catan");
  await expect(page.getByRole("heading", { name: /Events & sessions/ })).toBeVisible();
  await page.getByRole("link", { name: /Friday Night Catan/ }).click();
  await expect(page).toHaveURL(/\/events\/friday-catan-social-kora/);
});

test("command palette search is keyboard-usable", async ({ page }, info) => {
  test.skip(info.project.name.includes("mobile"), "palette shortcut is a desktop affordance");
  await page.goto("/games");
  await page.getByRole("button", { name: "Search games, venues, events" }).click();
  const input = page.getByRole("combobox", { name: /Search games/ });
  await input.fill("wingspan");
  await expect(page.getByRole("option", { name: /Wingspan/ }).first()).toBeVisible();
  await input.press("Enter");
  await expect(page).toHaveURL(/\/(games\/wingspan|events\/)/);
});

test("book a seat: sign in → hold → pay → QR → My Clan B", async ({ page }) => {
  await page.goto("/checkout/evt-001?quantity=1");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /Hold 1 seat/ }).click();

  await page.getByLabel("Email address").fill("e2e@example.com");
  await page.getByRole("button", { name: "Send code" }).click();
  await page.getByLabel("Verification code").fill("246810");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByRole("timer")).toBeVisible();
  // Recoverable failure first.
  await page.getByRole("radio", { name: /Test card/ }).click();
  await page.getByRole("button", { name: /^Pay / }).click();
  await expect(page.getByRole("alert").filter({ hasText: "declined" })).toBeVisible();
  await page.getByRole("radio", { name: /UPI/ }).click();
  await page.getByRole("button", { name: /^Pay / }).click();

  await expect(page.getByRole("heading", { name: "You're booked!" })).toBeVisible();
  await expect(page.locator("figure svg").first()).toBeVisible();

  await page.getByRole("link", { name: "View in My Clan B" }).click();
  await expect(page.getByText("Friday Night Catan & Craft Sodas").first()).toBeVisible();
});
