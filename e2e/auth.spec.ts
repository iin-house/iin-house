import { test, expect, loginUser } from "./fixtures";

test.describe("Auth smoke tests", () => {
  test("login page loads and shows demo credentials", async ({ page }) => {
    await page.goto("/login");

    // Page loads with branding
    await expect(page).toHaveURL(/\/login/);

    // Login form is present
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();

    // Demo credentials shown
    await expect(page.getByText(/demo/i)).toBeVisible();

    await page.screenshot({ path: "test-results/login-page.png", fullPage: true });
  });

  test("register page loads and validates form", async ({ page }) => {
    await page.goto("/register");

    await expect(page).toHaveURL(/\/register/);

    // Form fields are present
    await expect(page.getByLabel("Display name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password (min 10 chars)")).toBeVisible();

    // Submit empty form shows validation
    await page.getByRole("button", { name: /create account/i }).click();

    // Should still be on /register (validation blocks submission)
    await expect(page).toHaveURL(/\/register/);
  });

  test("register rejects short passwords", async ({ page }) => {
    await page.goto("/register");

    await page.getByLabel("Display name").fill("ShortPw");
    await page.getByLabel("Email").fill("shortpw@example.com");
    await page.getByLabel("Password (min 10 chars)").fill("short");
    await page.getByLabel("Confirm password").fill("short");
    await page.getByRole("button", { name: /create account/i }).click();

    // Validation error should appear
    const error = page.getByText(/password must|too short|at least 10/i);
    await expect(error).toBeVisible({ timeout: 5000 });
  });
});
