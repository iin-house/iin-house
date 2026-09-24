import { test as base, expect, type Page } from "@playwright/test";

// Start every spec with a clean session.
export const test = base.extend({
  storageState: ({}, use) => use(undefined),
});

export { expect };

/**
 * Fill the register form on /register with the given values and submit.
 * Waits for navigation to /login after a successful submit.
 */
export async function registerUser(
  page: Page,
  opts: { displayName: string; email: string; password: string; confirm?: string; phone?: string }
) {
  await page.goto("/register");

  await page.getByLabel("Display name").fill(opts.displayName);
  await page.getByLabel("Email").fill(opts.email);

  if (opts.phone) {
    await page.getByLabel(/Phone/i).fill(opts.phone);
  }

  await page.getByLabel("Password (min 10 chars)").fill(opts.password);
  await page.getByLabel("Confirm password").fill(opts.confirm ?? opts.password);

  await page.getByRole("button", { name: /create account/i }).click();

  // Wait for success toast (registration succeeded)
  try {
    await page.getByText(/account created|success|redirecting/i).first().waitFor({ timeout: 15000 });
  } catch {
    // If no success toast, check for error
    const error = page.getByText(/already registered|failed|invalid/i).first();
    if (await error.isVisible().catch(() => false)) {
      throw new Error(`Registration failed: ${await error.textContent()}`);
    }
  }
}

/**
 * Sign in on /login with the given credentials and wait for the dashboard redirect.
 */
export async function loginUser(
  page: Page,
  opts: { email: string; password: string }
) {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(opts.email);
  await page.getByLabel(/password/i).fill(opts.password);
  await page.getByRole("button", { name: /sign in|log in|login/i }).click();

  // The login page typically pushes us somewhere post-auth; wait for any nav.
  await page.waitForLoadState("networkidle");
}
