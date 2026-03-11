import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CommunityPage extends BasePage {
  readonly heading: Locator;
  readonly postLinks: Locator;
  readonly sortTabs: Locator;
  readonly emptyState: Locator;
  readonly loginPrompt: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole("heading", { level: 1 });
    // Post links navigate to /community/post/:id
    this.postLinks = page.locator("a[href*='/community/post/']");
    this.sortTabs = page.locator("button, a").filter({ hasText: /New|Top|Discussed/i });
    this.emptyState = page.getByText("No posts in this channel yet.");
    this.loginPrompt = page.locator("section, div").filter({ hasText: /sign in|login/i }).last();
  }

  async goto() {
    await this.page.goto("/en/community");
    await this.waitForPageReady();
  }

  async assertPageLoaded() {
    await expect(this.heading).toBeVisible();
  }

  /**
   * Click a post to navigate to its detail page.
   * The VoteButtons inside the link catch clicks on the first part of the card.
   * We click on the <h2> title element inside the link to ensure navigation.
   */
  async clickFirstPost() {
    const firstPostLink = this.postLinks.first();
    const href = await firstPostLink.getAttribute("href");
    // Click the h2 title inside the link, which is safe from VoteButton intercepts
    const titleInPost = firstPostLink.locator("h2").first();
    await titleInPost.click();
    return href;
  }
}

export class PostDetailPage extends BasePage {
  readonly heading: Locator;
  readonly breadcrumb: Locator;
  readonly articleContent: Locator;
  readonly commentsSection: Locator;
  readonly backLink: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole("heading", { level: 1 });
    this.breadcrumb = page.locator("nav").filter({ hasText: /community/i }).last();
    this.articleContent = page.locator("article");
    this.commentsSection = page.locator("h2").filter({ hasText: /comment/i });
    this.backLink = page.getByRole("link", { name: /community/i }).first();
  }

  async assertPageLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.articleContent).toBeVisible();
  }
}
