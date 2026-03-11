import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * BasePage — shared helpers for all Page Object Models.
 *
 * All routes use the /en locale prefix since that is the default locale
 * and the dev server does not redirect bare paths to a locale.
 */
export class BasePage {
  readonly page: Page;

  // Nav elements present on every page
  readonly navLogo: Locator;
  readonly navSkillsLink: Locator;
  readonly navPlaybooksLink: Locator;
  readonly navDocsLink: Locator;
  readonly navCommunityLink: Locator;
  readonly navGetStartedLink: Locator;
  readonly navThemeToggle: Locator;
  readonly navSearchButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.navLogo = page.locator("nav a").filter({ hasText: "Lobster U" }).first();
    this.navSkillsLink = page.locator("nav").getByRole("link", { name: /^Skills$/i });
    this.navPlaybooksLink = page.locator("nav").getByRole("link", { name: /^Playbooks$/i });
    this.navDocsLink = page.locator("nav").getByRole("link", { name: /^Docs$/i });
    this.navCommunityLink = page.locator("nav").getByRole("link", { name: /^Community$/i });
    this.navGetStartedLink = page.locator("nav").getByRole("link", { name: /^Get Started$/i });
    this.navThemeToggle = page.getByRole("button", { name: /toggle theme/i });
    this.navSearchButton = page.getByRole("button", { name: /search/i });
  }

  async waitForPageReady() {
    await this.page.waitForLoadState("domcontentloaded");
  }

  async assertNavVisible() {
    await expect(this.navLogo).toBeVisible();
    await expect(this.navSkillsLink).toBeVisible();
    await expect(this.navCommunityLink).toBeVisible();
  }
}
