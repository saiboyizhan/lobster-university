import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SkillsPage extends BasePage {
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly skillCards: Locator;
  readonly emptyState: Locator;
  readonly categoryFilterButtons: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole("heading", { level: 1 });
    this.searchInput = page.locator('input[type="text"]').first();
    // Skill cards are inside SkillsExplorer grid — they have a <code> child with skill name.
    // Scope to the main content area (not the nav).
    // The skill cards link to slugs that are NOT "leaderboard".
    this.skillCards = page
      .locator("a[href*='/skills/']")
      .filter({ has: page.locator("code") });
    this.emptyState = page.getByText("No skills found.");
    this.categoryFilterButtons = page.locator("button").filter({
      hasText: /All|Information|Content|Code|Creative|Crypto|Self/i,
    });
  }

  async goto() {
    await this.page.goto("/en/skills");
    await this.waitForPageReady();
  }

  async assertPageLoaded() {
    await expect(this.heading).toBeVisible();
    // Skills are loaded from static data, so there should always be cards
    await expect(this.skillCards.first()).toBeVisible();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async clickFirstSkillCard() {
    const firstCard = this.skillCards.first();
    const href = await firstCard.getAttribute("href");
    await firstCard.click();
    return href;
  }
}

export class SkillDetailPage extends BasePage {
  readonly heading: Locator;
  readonly backLink: Locator;

  constructor(page: Page) {
    super(page);

    // First h1 on the skill detail page is the skill name (@lobster-u/...)
    this.heading = page.locator("h1").first();
    this.backLink = page.getByRole("link", { name: /back|skills/i });
  }

  async assertPageLoaded() {
    await expect(this.heading).toBeVisible();
  }
}
