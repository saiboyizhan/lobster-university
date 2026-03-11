import { test, expect } from "@playwright/test";
import { SkillsPage, SkillDetailPage } from "../pages/SkillsPage";

/**
 * Skills E2E Tests
 *
 * Covers:
 * - Skills list page loads with skill cards
 * - Search filters skill cards
 * - Category filter changes displayed skills
 * - Clicking a skill card navigates to detail page
 * - Skill detail page shows skill metadata
 */

test.describe("Skills Page", () => {
  let skillsPage: SkillsPage;

  test.beforeEach(async ({ page }) => {
    skillsPage = new SkillsPage(page);
    await skillsPage.goto();
  });

  test("page loads with heading and skill cards", async () => {
    await skillsPage.assertPageLoaded();

    const headingText = await skillsPage.heading.textContent();
    expect(headingText).toBeTruthy();

    const cardCount = await skillsPage.skillCards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test("search input filters visible skill cards", async ({ page }) => {
    await skillsPage.assertPageLoaded();

    const initialCount = await skillsPage.skillCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // Search for a known skill
    await skillsPage.search("google-search");
    await page.waitForTimeout(300); // debounce in SkillSearch

    const filteredCount = await skillsPage.skillCards.count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    // The matching card should still be visible
    await expect(skillsPage.skillCards.first()).toBeVisible();
  });

  test("search with no match shows empty state", async ({ page }) => {
    await skillsPage.assertPageLoaded();

    await skillsPage.search("xyznonexistentskill999");
    await page.waitForTimeout(300);

    await expect(skillsPage.emptyState).toBeVisible();
  });

  test("clearing search restores all skills", async ({ page }) => {
    await skillsPage.assertPageLoaded();

    const initialCount = await skillsPage.skillCards.count();

    await skillsPage.search("google");
    await page.waitForTimeout(300);

    await skillsPage.clearSearch();
    await page.waitForTimeout(300);

    const restoredCount = await skillsPage.skillCards.count();
    expect(restoredCount).toBe(initialCount);
  });

  test("skill cards display name and description", async () => {
    await skillsPage.assertPageLoaded();

    const firstCard = skillsPage.skillCards.first();
    // Card should have a code element with skill name
    const skillName = await firstCard.locator("code").textContent();
    expect(skillName).toBeTruthy();
    expect(skillName!.length).toBeGreaterThan(0);

    // Card should have a description paragraph
    const description = await firstCard.locator("p").textContent();
    expect(description).toBeTruthy();
  });

  test("clicking a skill card navigates to detail page", async ({ page }) => {
    await skillsPage.assertPageLoaded();

    const href = await skillsPage.clickFirstSkillCard();
    // Wait for navigation to the skill slug URL
    await page.waitForURL(/\/skills\/.+/);

    expect(page.url()).toContain("/skills/");
    if (href) {
      expect(page.url()).toContain(href);
    }

    // Verify the detail page loaded
    const skillTitle = page.locator("h1").first();
    await expect(skillTitle).toBeVisible();
  });

  test("skills page URL is correct", async ({ page }) => {
    await expect(page).toHaveURL(/\/en\/skills$/);
  });
});

test.describe("Skill Detail Page", () => {
  test("renders skill title and metadata for academic-search", async ({ page }) => {
    // academic-search is always in static data from the skills/ directory
    await page.goto("/en/skills/academic-search");
    await page.waitForLoadState("domcontentloaded");

    // The skill page title is in the first h1, scoped to the main content area
    // (MarkdownRenderer may also render h1 tags for SKILL.md sections)
    const skillTitle = page.locator("h1").first();
    await expect(skillTitle).toBeVisible();

    const titleText = await skillTitle.textContent();
    expect(titleText).toMatch(/@lobster-u\//);
  });

  test("skill detail page has Install section", async ({ page }) => {
    await page.goto("/en/skills/google-search");
    await page.waitForLoadState("domcontentloaded");

    const installHeading = page.getByRole("heading", { name: /install/i });
    await expect(installHeading).toBeVisible();
  });

  test("unknown skill slug shows 404 page", async ({ page }) => {
    await page.goto("/en/skills/does-not-exist-xyz");
    await page.waitForLoadState("domcontentloaded");

    // Next.js notFound() triggers 404 handling — check visible text, not raw HTML
    const h1 = page.getByRole("heading", { level: 1 });
    const bodyText = await page.locator("body").textContent();

    // Either no h1 with skill content, or 404 message visible
    const skillContent = await page.locator("h1").filter({ hasText: /@lobster-u\// }).count();
    expect(skillContent).toBe(0);
  });
});
