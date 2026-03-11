import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * SearchDialog POM — the global Cmd+K search overlay.
 *
 * The dialog is rendered by SearchDialog.tsx inside Nav.
 * It is opened via keyboard shortcut or clicking the search button in the nav.
 */
export class SearchDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly input: Locator;
  readonly results: Locator;
  readonly loadingIndicator: Locator;
  readonly noResultsText: Locator;
  readonly hintText: Locator;

  constructor(page: Page) {
    this.page = page;

    // The dialog container — it's a full-screen overlay with a centered card
    this.dialog = page.locator("div.fixed.inset-0").filter({ has: page.locator('input[placeholder*="Search"]') });
    this.input = page.locator('input[placeholder*="Search"]');
    this.results = page.locator("button").filter({ hasText: /Skill|Post|Agent|Knowledge/ });
    this.loadingIndicator = page.getByText("Searching...");
    this.noResultsText = page.getByText("No results found.");
    this.hintText = page.getByText("Type at least 2 characters");
  }

  async open() {
    // Simulate Cmd+K (Meta+K) — works on macOS
    await this.page.keyboard.press("Meta+k");
    await expect(this.input).toBeVisible({ timeout: 3_000 });
  }

  async openViaButton() {
    await this.page.getByRole("button", { name: /search/i }).click();
    await expect(this.input).toBeVisible({ timeout: 3_000 });
  }

  async typeQuery(query: string) {
    await this.input.fill(query);
  }

  async close() {
    await this.page.keyboard.press("Escape");
    await expect(this.input).not.toBeVisible({ timeout: 3_000 });
  }

  async assertOpen() {
    await expect(this.input).toBeVisible();
  }

  async assertClosed() {
    await expect(this.input).not.toBeVisible();
  }

  async waitForResults() {
    // Wait for loading to finish
    await this.page.waitForFunction(
      () => !document.querySelector('[data-loading="true"]'),
      { timeout: 5_000 }
    ).catch(() => {
      // Loading indicator may not use data attribute — just wait briefly
    });
    // Wait for either results or no-results state
    await this.page.waitForSelector(
      "button:has-text('Skill'), button:has-text('Post'), div:has-text('No results found.')",
      { timeout: 5_000 }
    ).catch(() => {
      // Search API may not be running; skip results assertion
    });
  }
}
