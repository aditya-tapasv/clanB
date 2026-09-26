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

test("book a seat as a guest: hold → pay → QR", async ({ page }) => {
  await page.goto("/checkout/evt-001?quantity=1");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /Hold 1 seat/ }).click();

  await expect(page.getByRole("timer")).toBeVisible();
  // Recoverable failure first.
  await page.getByRole("radio", { name: /Test card/ }).click();
  await page.getByRole("button", { name: /^Pay / }).click();
  await expect(page.getByRole("alert").filter({ hasText: "declined" })).toBeVisible();
  await page.getByRole("radio", { name: /UPI/ }).click();
  await page.getByRole("button", { name: /^Pay / }).click();

  await expect(page.getByRole("heading", { name: "You're booked!" })).toBeVisible();
  await expect(page.locator("figure svg").first()).toBeVisible();

  await page.getByRole("link", { name: "Explore more venues" }).click();
  await expect(page).toHaveURL(/\/venues$/);
});

test("contact us: name + query shows the confirmation popup", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByText("Enter your name.")).toBeVisible();
  await page.getByLabel("Name").fill("E2E Tester");
  await page.getByLabel("Query").fill("Do you run corporate game nights in Whitefield?");
  await page.getByRole("button", { name: "Submit" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Query received!" })).toBeVisible();
  await dialog.getByRole("button", { name: "Done" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByLabel("Name")).toHaveValue("");
});

test("venues are paginated", async ({ page }) => {
  await page.goto("/venues");
  const cards = page.locator("article");
  await expect(cards).toHaveCount(6);
  await page.getByRole("button", { name: "Page 2" }).click();
  await expect(page.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
  await expect(cards).toHaveCount(6);
});
