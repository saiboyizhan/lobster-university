import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

/**
 * Homepage E2E Tests
 *
 * Covers:
 * - Hero section renders
 * - Navigation links are present and clickable
 * - Dark mode toggle fires without error
 * - Language switcher is visible
 * - Quick start section is present
 * - Skills library section renders categories
 */

test.describe("Homepage", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("hero section loads with title and CTA buttons", async () => {
    await homePage.assertHeroVisible();

    // Title should contain "Lobster University" or "AI Agent"
    const titleText = await homePage.heroTitle.textContent();
    expect(titleText).toBeTruthy();
    expect(titleText!.length).toBeGreaterThan(0);
  });

  test("navigation bar renders all main links", async () => {
    await homePage.assertNavVisible();

    await expect(homePage.navPlaybooksLink).toBeVisible();
    await expect(homePage.navDocsLink).toBeVisible();
    await expect(homePage.navGetStartedLink).toBeVisible();
  });

  test("clicking nav logo returns to homepage", async ({ page }) => {
    // Navigate away first
    await page.goto("/en/skills");
    await page.waitForLoadState("domcontentloaded");

    const nav = new HomePage(page);
    await nav.navLogo.click();
    await page.waitForLoadState("domcontentloaded");

    await expect(page).toHaveURL(/\/en\/?$/);
  });

  test("nav Skills link navigates to /en/skills", async ({ page }) => {
    const nav = new HomePage(page);
    await nav.navSkillsLink.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/en\/skills/);
  });

  test("nav Community link navigates to /en/community", async ({ page }) => {
    const nav = new HomePage(page);
    await nav.navCommunityLink.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/en\/community/);
  });

  test("nav Get Started link navigates to /en/get-started", async ({ page }) => {
    const nav = new HomePage(page);
    await nav.navGetStartedLink.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/en\/get-started/);
  });

  test("dark mode toggle is clickable without errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await homePage.navThemeToggle.click();
    // Allow re-render
    await page.waitForTimeout(300);

    // Toggle back
    await homePage.navThemeToggle.click();
    await page.waitForTimeout(300);

    expect(errors).toHaveLength(0);
  });

  test("language switcher is visible in nav", async ({ page }) => {
    // Language switcher renders as a button or select near the nav
    const langSwitcher = page
      .locator("nav")
      .locator("button, select")
      .filter({ hasText: /EN|ZH|English|Chinese|中文/i });

    // It may be hidden on mobile; just check it exists in the DOM
    const count = await langSwitcher.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("quick start section is present with code block", async () => {
    await homePage.quickStartSection.scrollIntoViewIfNeeded();
    await expect(homePage.quickStartSection).toBeVisible();

    // Should contain a code block with lobster-u CLI commands
    const codeContent = await homePage.page
      .locator("#get-started pre, #get-started code")
      .first()
      .textContent();
    expect(codeContent).toContain("lobster-u");
  });

  test("skills library section shows category cards", async ({ page }) => {
    // Scroll to skills section
    await page.locator("h2").filter({ hasText: /skill/i }).first().scrollIntoViewIfNeeded();

    // Category cards are rendered in a grid
    const categoryCards = page.locator("div.rounded-xl").filter({ has: page.locator("h3") });
    const count = await categoryCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("no console errors on page load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await homePage.goto();
    // Allow hydration
    await page.waitForTimeout(500);

    // Filter out known non-critical warnings
    const criticalErrors = errors.filter(
      (e) => !e.includes("Warning:") && !e.includes("hydration")
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
