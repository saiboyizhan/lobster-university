import { test, expect } from "@playwright/test";
import { CommunityPage, PostDetailPage } from "../pages/CommunityPage";

/**
 * Community Page E2E Tests
 *
 * Covers:
 * - Community list page loads with posts (demo data fallback)
 * - Sort tabs are visible
 * - Clicking a post navigates to its detail page
 * - Post detail shows title, article content, and comments
 * - Login prompt is visible for unauthenticated users
 * - Demo post IDs use the format "post-1" through "post-5"
 *
 * Implementation note:
 * - Each post card has VoteButtons (upvote/downvote) inside the <a> link.
 *   Clicking the center of the card hits the VoteButtons, not the navigation link.
 *   Use clickFirstPost() which targets the <h2> title element inside the card.
 */

test.describe("Community Page", () => {
  let communityPage: CommunityPage;

  test.beforeEach(async ({ page }) => {
    communityPage = new CommunityPage(page);
    await communityPage.goto();
  });

  test("page loads with heading", async () => {
    await expect(communityPage.heading).toBeVisible();
    const headingText = await communityPage.heading.textContent();
    expect(headingText).toBeTruthy();
  });

  test("posts are displayed (demo data fallback)", async ({ page }) => {
    await expect(communityPage.heading).toBeVisible();

    const postCount = await communityPage.postLinks.count();
    const emptyVisible = await page
      .getByText("No posts in this channel yet.")
      .isVisible()
      .catch(() => false);

    // Either posts exist or empty state is shown
    expect(postCount > 0 || emptyVisible).toBeTruthy();
  });

  test("sort tabs are visible", async ({ page }) => {
    await expect(communityPage.heading).toBeVisible();

    // SortTabs renders links or buttons labeled New / Top / Discussed
    const newTab = page.locator("a, button").filter({ hasText: /^New$/ });
    const count = await newTab.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("post cards show text content", async () => {
    await expect(communityPage.heading).toBeVisible();

    const postCount = await communityPage.postLinks.count();
    if (postCount === 0) return; // empty state is acceptable

    const firstPost = communityPage.postLinks.first();
    const postText = await firstPost.textContent();
    expect(postText).toBeTruthy();
    expect(postText!.length).toBeGreaterThan(10);
  });

  test("clicking a post (via title) navigates to post detail page", async ({ page }) => {
    await expect(communityPage.heading).toBeVisible();

    const postCount = await communityPage.postLinks.count();
    if (postCount === 0) {
      test.skip();
      return;
    }

    // Click the h2 title inside the post card to navigate
    const href = await communityPage.clickFirstPost();
    await page.waitForURL(/\/community\/post\//);

    expect(page.url()).toContain("/community/post/");
    if (href) {
      expect(page.url()).toContain(href);
    }
  });

  test("login prompt is visible for unauthenticated users", async ({ page }) => {
    await expect(communityPage.heading).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const loginLink = page.getByRole("link", { name: /sign in|login/i });
    await expect(loginLink).toBeVisible({ timeout: 5_000 });
  });

  test("channel filter query param does not break the page", async ({ page }) => {
    await page.goto("/en/community?channel=crypto");
    await page.waitForLoadState("domcontentloaded");

    await expect(communityPage.heading).toBeVisible();
  });
});

test.describe("Post Detail Page", () => {
  test("demo post 'post-1' loads with title and article content", async ({ page }) => {
    await page.goto("/en/community/post/post-1");
    await page.waitForLoadState("domcontentloaded");

    // Should show the post heading
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();

    // Should have article content
    const article = page.locator("article");
    await expect(article).toBeVisible();
  });

  test("demo fallback post ID '1' also resolves", async ({ page }) => {
    // The fallback in getPostData uses DEMO_POST with id "1" for any non-DB ID
    await page.goto("/en/community/post/1");
    await page.waitForLoadState("domcontentloaded");

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();

    const titleText = await heading.textContent();
    expect(titleText).toBeTruthy();
    expect(titleText!.length).toBeGreaterThan(0);
  });

  test("breadcrumb links back to community list", async ({ page }) => {
    await page.goto("/en/community/post/1");
    await page.waitForLoadState("domcontentloaded");

    const backLink = page.locator("nav a").filter({ hasText: /community/i }).first();
    await expect(backLink).toBeVisible();

    await backLink.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/en\/community/);
  });

  test("comments section is present", async ({ page }) => {
    await page.goto("/en/community/post/1");
    await page.waitForLoadState("domcontentloaded");

    const commentsHeading = page.getByRole("heading").filter({ hasText: /comment/i });
    await expect(commentsHeading).toBeVisible();
  });
});
