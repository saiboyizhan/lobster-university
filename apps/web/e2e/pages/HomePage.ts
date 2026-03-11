import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly heroTitle: Locator;
  readonly heroGetStartedBtn: Locator;
  readonly heroGithubBtn: Locator;
  readonly quickStartSection: Locator;
  readonly skillsLibrarySection: Locator;
  readonly featuresSection: Locator;
  readonly enrollmentStepsSection: Locator;

  constructor(page: Page) {
    super(page);

    this.heroTitle = page.locator("h1").first();
    this.heroGetStartedBtn = page.getByRole("link", { name: /get started/i }).first();
    this.heroGithubBtn = page.getByRole("link", { name: /view github/i });
    this.quickStartSection = page.locator("#get-started");
    this.skillsLibrarySection = page.locator("section").filter({ hasText: /Skills Library|skill/i }).nth(1);
    this.featuresSection = page.locator("section").filter({ hasText: /Features|feature/i }).first();
    this.enrollmentStepsSection = page.locator("section").filter({ hasText: /Three Steps/i }).first();
  }

  async goto() {
    await this.page.goto("/en");
    await this.waitForPageReady();
  }

  async assertHeroVisible() {
    await expect(this.heroTitle).toBeVisible();
    await expect(this.heroGetStartedBtn).toBeVisible();
  }

  async clickGetStartedHero() {
    await this.heroGetStartedBtn.click();
  }
}
