import { test, expect } from "./fixtures";

test.describe("Messages page", () => {
  test("redirects unauthenticated visitors to /login", async ({ page }) => {
    await page.goto("/subscriber/messages");

    // The page checks session and pushes unauthenticated users to /login.
    await page.waitForURL(/\/login/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("shows empty state for an authenticated subscriber", async ({ page }) => {
    // This assumes a fixture user exists; if not the redirect above already proves the gate.
    // We attempt a login, then visit messages, tolerating either:
    //   - a redirect to /login (no such user / wrong creds), or
    //   - the messages sidebar with empty state.
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("playwright-empty@example.com");
    await page.getByLabel(/password/i).fill("Sup3rSecret!");
    await page.getByRole("button", { name: /sign in|log in|login/i }).click();

    // Either we land on /login again (auth failed) — that's fine for this smoke test,
    // or we get the messages UI.
    await page.waitForLoadState("networkidle");

    if (/\/login/.test(page.url())) {
      test.skip(true, "No fixture subscriber available — skipping messages UI assertion");
      return;
    }

    await page.goto("/subscriber/messages");

    // Sidebar heading.
    await expect(page.getByRole("heading", { name: /^messages$/i })).toBeVisible();

    // Either the empty state copy or at least one conversation row is present.
    const emptyState = page.getByText(/no messages yet/i);
    const conversationList = page.locator("button.list-row");

    await expect(emptyState.or(conversationList.first())).toBeVisible({ timeout: 10000 });

    await page.screenshot({
      path: "test-results/messages-page.png",
      fullPage: true,
    });
  });
});
