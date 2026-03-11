import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class GetStartedPage extends BasePage {
  readonly heading: Locator;
  readonly stepLinks: Locator;
  readonly beforeAfterCards: Locator;
  readonly phaseLabels: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole("heading", { level: 1 });
    // Step links go to /get-started/step/:num
    this.stepLinks = page.locator("a[href*='/get-started/step/']");
    this.beforeAfterCards = page.locator("div").filter({ hasText: /before|after/i });
    this.phaseLabels = page.locator("span, div").filter({ hasText: /setup|activate|stabilize|optimize|systematize/i });
  }

  async goto() {
    await this.page.goto("/en/get-started");
    await this.waitForPageReady();
  }

  async assertPageLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.stepLinks.first()).toBeVisible();
  }

  async clickStep(stepNumber: number) {
    const stepLink = this.page.locator(`a[href*='/get-started/step/${stepNumber}']`).first();
    await stepLink.click();
  }
}

export class StepDetailPage extends BasePage {
  readonly heading: Locator;
  readonly progressBar: Locator;
  readonly goalSection: Locator;
  readonly tasksSection: Locator;
  readonly expectedOutputSection: Locator;
  readonly nextStepButton: Locator;
  readonly prevStepButton: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole("heading", { level: 1 });
    this.progressBar = page.locator("div.rounded-full").filter({ has: page.locator("div.bg-zinc-900, div.bg-white") }).first();
    this.goalSection = page.getByRole("heading", { name: /goal/i });
    this.tasksSection = page.getByRole("heading", { name: /tasks/i });
    this.expectedOutputSection = page.getByText(/expected output/i);
    this.nextStepButton = page.getByRole("link", { name: /next/i });
    this.prevStepButton = page.getByRole("link", { name: /prev|previous/i });
  }

  async assertPageLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.goalSection).toBeVisible();
    await expect(this.tasksSection).toBeVisible();
  }

  async goToNextStep() {
    await this.nextStepButton.click();
  }
}
