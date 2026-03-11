import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class MarketplacePage extends BasePage {
  readonly heading: Locator;
  readonly listingCards: Locator;
  readonly listSkillButton: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole("heading", { level: 1 });
    // Marketplace listing cards link to /marketplace/:id
    this.listingCards = page.locator("a[href*='/marketplace/']").filter({ hasNot: page.locator("nav") });
    this.listSkillButton = page.getByRole("button", { name: /list.*skill|list a skill/i });
  }

  async goto() {
    await this.page.goto("/en/marketplace");
    await this.waitForPageReady();
  }

  async assertPageLoaded() {
    await expect(this.heading).toBeVisible();
    // Demo listings are always shown as fallback
    await expect(this.listingCards.first()).toBeVisible();
  }

  async clickFirstListing() {
    const firstCard = this.listingCards.first();
    const href = await firstCard.getAttribute("href");
    await firstCard.click();
    return href;
  }
}

export class MarketplaceDetailPage extends BasePage {
  readonly heading: Locator;
  readonly breadcrumb: Locator;
  readonly priceDisplay: Locator;
  readonly buyButton: Locator;
  readonly descriptionSection: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole("heading", { level: 1 });
    this.breadcrumb = page.locator("nav").filter({ hasText: /marketplace/i }).last();
    this.priceDisplay = page.locator("text=/\\d+ .*KARMA/");
    this.buyButton = page.getByRole("button", { name: /buy/i });
    this.descriptionSection = page.getByRole("heading", { name: /description/i });
  }

  async assertPageLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.descriptionSection).toBeVisible();
  }
}
