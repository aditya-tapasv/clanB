import { test, expect } from "./fixtures";

// FRD §26.1 #2 — search finds an event; #4 — mock booking end to end (UI level).

test("search page finds an event and opens it", async ({ page }) => {
  await page.goto("/search?q=catan");
  await expect(page.getByRole("heading", { name: /Events & sessions/ })).toBeVisible();
  await page.getByRole("link", { name: /Friday Night Catan/ }).click();
  await expect(page).toHaveURL(/\/events\/friday-catan-social-kora/);
});

test("OTP login routes each role to its own area", async ({ page }) => {
  for (const [email, home] of [
    ["admin@clanb.in", /\/admin$/],
    ["vendor@clanb.in", /\/vendor$/],
    ["player@example.com", /\/account$/],
  ] as const) {
    await page.goto("/login");
    await page.getByRole("button", { name: "Email" }).click();
    await page.getByLabel("Email address").fill(email);
    await page.getByRole("button", { name: "Send OTP" }).click();
    await page.getByLabel("Enter the 6-digit code").fill("123456");
    await page.getByRole("button", { name: /Verify & log in/ }).click();
    await expect(page).toHaveURL(home);
    // A player can't open the admin area.
    if (email === "player@example.com") {
      await page.goto("/admin");
      await expect(page).toHaveURL(/\/account$/);
    }
    await page.context().clearCookies();
  }
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
