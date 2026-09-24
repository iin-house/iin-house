import { test, expect } from "./fixtures";

test.describe("Feed page", () => {
  test("renders header, search input, and category buttons", async ({ page }) => {
    await page.goto("/feed");

    // Header brand.
    await expect(page.getByRole("link", { name: /iin house/i }).first()).toBeVisible();

    // Search input is present (placeholder text).
    const search = page.getByPlaceholder(/search creators/i);
    await expect(search).toBeVisible();

    // Category buttons exist.
    for (const label of ["All", "Art", "Music", "Fitness", "Tech"]) {
      await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
    }

    // Visual reference for the review pass.
    await page.screenshot({
      path: "test-results/feed-page.png",
      fullPage: true,
    });
  });
});
