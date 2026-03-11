import { test, expect } from "@playwright/test";
import { SearchDialog } from "../pages/SearchDialog";

/**
 * Search Dialog E2E Tests
 *
 * Covers:
 * - Cmd+K opens the search dialog
 * - Dialog has a text input
 * - Typing less than 2 characters shows hint text
 * - Typing 2+ characters triggers a search request
 * - Escape closes the dialog
 * - Clicking the backdrop closes the dialog
 * - Search button in nav opens dialog
 *
 * Note: The /api/search endpoint may return empty results if DB has no data,
 * but the dialog UI mechanics are tested independently.
 */

test.describe("Search Dialog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("domcontentloaded");
    // Wait for hydration so keyboard events are processed
    await page.waitForTimeout(500);
  });

  test("Cmd+K opens the search dialog", async ({ page }) => {
    const dialog = new SearchDialog(page);

    await dialog.assertClosed();
    await dialog.open();
    await dialog.assertOpen();
  });

  test("search dialog has a text input with placeholder", async ({ page }) => {
    const dialog = new SearchDialog(page);
    await dialog.open();

    await expect(dialog.input).toBeVisible();
    const placeholder = await dialog.input.getAttribute("placeholder");
    expect(placeholder).toBeTruthy();
    expect(placeholder!.length).toBeGreaterThan(0);
  });

  test("hint text shown when fewer than 2 characters typed", async ({ page }) => {
    const dialog = new SearchDialog(page);
    await dialog.open();

    // Empty input — hint should be visible
    await expect(dialog.hintText).toBeVisible();

    // Single character — still too short
    await dialog.typeQuery("a");
    await expect(dialog.hintText).toBeVisible();
  });

  test("hint text hides when 2+ characters typed", async ({ page }) => {
    const dialog = new SearchDialog(page);
    await dialog.open();

    await dialog.typeQuery("sk");
    await page.waitForTimeout(300); // allow debounce

    // Hint should be gone
    await expect(dialog.hintText).not.toBeVisible();
  });

  test("Escape key closes the dialog", async ({ page }) => {
    const dialog = new SearchDialog(page);
    await dialog.open();
    await dialog.assertOpen();

    await dialog.close();
    await dialog.assertClosed();
  });

  test("clicking the backdrop closes the dialog", async ({ page }) => {
    const dialog = new SearchDialog(page);
    await dialog.open();
    await dialog.assertOpen();

    // Click outside the dialog card (the dark backdrop)
    await page.mouse.click(10, 10);
    await page.waitForTimeout(200);

    await dialog.assertClosed();
  });

  test("search button in nav opens dialog", async ({ page }) => {
    const dialog = new SearchDialog(page);

    // Click the search button in the nav bar
    const searchBtn = page.getByRole("button", { name: /search/i });
    await expect(searchBtn).toBeVisible();
    await searchBtn.click();

    await dialog.assertOpen();
  });

  test("typing a query sends request to /api/search", async ({ page }) => {
    const dialog = new SearchDialog(page);

    let searchRequestMade = false;
    page.on("request", (req) => {
      if (req.url().includes("/api/search")) {
        searchRequestMade = true;
      }
    });

    await dialog.open();
    await dialog.typeQuery("google");

    // Wait for debounce (200ms) + a bit more
    await page.waitForTimeout(500);

    expect(searchRequestMade).toBeTruthy();
  });

  test("dialog shows 'No results found' when API returns empty", async ({ page }) => {
    const dialog = new SearchDialog(page);

    // Intercept the search API and return empty results
    await page.route("**/api/search*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ results: [] }),
      });
    });

    await dialog.open();
    await dialog.typeQuery("xyznonexistentterm123");
    await page.waitForTimeout(600);

    await expect(dialog.noResultsText).toBeVisible({ timeout: 3_000 });
  });

  test("dialog shows results when API returns data", async ({ page }) => {
    const dialog = new SearchDialog(page);

    // Mock search API to return a skill result
    await page.route("**/api/search*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: [
            {
              type: "skill",
              id: "google-search",
              title: "@lobster-u/google-search",
              description: "Search the web with Google",
              url: "/en/skills/google-search",
            },
          ],
        }),
      });
    });

    await dialog.open();
    await dialog.typeQuery("google");
    await page.waitForTimeout(600);

    // Result should show the mocked skill
    const resultButton = page.locator("button").filter({ hasText: /@lobster-u\/google-search/ });
    await expect(resultButton).toBeVisible({ timeout: 3_000 });
  });

  test("reopening dialog clears previous query", async ({ page }) => {
    const dialog = new SearchDialog(page);

    await dialog.open();
    await dialog.typeQuery("test query");
    await dialog.close();

    await dialog.open();

    // Input should be empty after re-open
    const value = await dialog.input.inputValue();
    expect(value).toBe("");
  });
});
