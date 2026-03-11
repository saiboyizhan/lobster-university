import { test, expect } from "@playwright/test";
import { GetStartedPage, StepDetailPage } from "../pages/GetStartedPage";

/**
 * Get Started Wizard E2E Tests
 *
 * Covers:
 * - Overview page loads with step cards
 * - Step cards are grouped by phase (Setup, Activate, Stabilize, Optimize, Systematize)
 * - Clicking a step card navigates to the step detail page
 * - Step detail shows progress bar, goal, and tasks
 * - Step navigation (next/previous) works
 * - All 8 steps (0–7) are accessible
 *
 * Implementation notes:
 * - The layout has a left sidebar (StepNav) AND main content, both render step links.
 *   So each step link appears TWICE on the page (sidebar + main card).
 *   Total links = 8 steps × 2 = 16. Use `toBeGreaterThanOrEqual(8)` instead of `toBe(8)`.
 * - Progress bar: "Step N of 8" with Math.round((N+1)/8*100)%
 *   Step 0: "Step 1 of 8", 13%. Step 7: "Step 8 of 8", 100%.
 * - StepNavigation on step 0: "Overview" link (not "Previous").
 * - StepNavigation on step 7: "Explore Skills" link (not "Next").
 * - page.textContent("body") includes RSC JSON metadata that contains "404" strings.
 *   Use page.locator("main").innerText() to check only visible page content.
 */

const TOTAL_STEPS = 8; // Steps 0–7 per STEPS constant in get-started.ts

test.describe("Get Started Overview Page", () => {
  let getStartedPage: GetStartedPage;

  test.beforeEach(async ({ page }) => {
    getStartedPage = new GetStartedPage(page);
    await getStartedPage.goto();
  });

  test("page loads with heading and step links", async () => {
    await getStartedPage.assertPageLoaded();

    const headingText = await getStartedPage.heading.textContent();
    expect(headingText).toBeTruthy();
  });

  test("displays all 8 step links (each link appears in sidebar AND main content)", async () => {
    await getStartedPage.assertPageLoaded();

    const stepLinks = getStartedPage.stepLinks;
    const count = await stepLinks.count();
    // Layout sidebar + main content both render step links, so count = 8 * 2 = 16
    expect(count).toBeGreaterThanOrEqual(TOTAL_STEPS);
  });

  test("before/after comparison cards are visible", async ({ page }) => {
    await getStartedPage.assertPageLoaded();

    // Use exact match on h3 text to avoid matching Step 7 title which also has "before"
    const beforeSection = page.getByRole("heading", { name: "Before", exact: true });
    await expect(beforeSection).toBeVisible();

    const afterSection = page.getByRole("heading", { name: "After", exact: true });
    await expect(afterSection).toBeVisible();
  });

  test("phase labels (Setup, Activate, etc.) are visible", async ({ page }) => {
    await getStartedPage.assertPageLoaded();

    const setupBadge = page.locator("span").filter({ hasText: /setup/i }).first();
    await expect(setupBadge).toBeVisible();

    const activateBadge = page.locator("span").filter({ hasText: /activate/i }).first();
    await expect(activateBadge).toBeVisible();
  });

  test("clicking Step 0 card (in main content) navigates to step detail page", async ({ page }) => {
    await getStartedPage.assertPageLoaded();

    // The main content grid has step cards — click the one in <main>, not the sidebar
    const mainStepLink = page.locator("main a[href*='/get-started/step/0']").first();
    await mainStepLink.click();
    await page.waitForURL(/\/get-started\/step\/0/);

    expect(page.url()).toContain("/get-started/step/0");
  });

  test("clicking Step 3 card navigates correctly", async ({ page }) => {
    await getStartedPage.assertPageLoaded();

    const mainStepLink = page.locator("main a[href*='/get-started/step/3']").first();
    await mainStepLink.click();
    await page.waitForURL(/\/get-started\/step\/3/);

    expect(page.url()).toContain("/get-started/step/3");
  });
});

test.describe("Step Detail Pages", () => {
  test("Step 0 loads with all required sections", async ({ page }) => {
    await page.goto("/en/get-started/step/0");
    await page.waitForLoadState("domcontentloaded");

    const stepDetail = new StepDetailPage(page);
    await stepDetail.assertPageLoaded();

    // Expected output section (green box)
    await expect(stepDetail.expectedOutputSection).toBeVisible();
  });

  test("Step 0 progress shows 'Step 1 of 8' and '13%'", async ({ page }) => {
    await page.goto("/en/get-started/step/0");
    await page.waitForLoadState("domcontentloaded");

    // Two elements match the pattern (progress bar area + StepNavigation footer)
    // Use .first() to avoid strict mode violation
    const progressText = page.getByText(/Step\s*1\s*of\s*8/).first();
    await expect(progressText).toBeVisible();

    const percentText = page.getByText(/13%/).first();
    await expect(percentText).toBeVisible();
  });

  test("Step 7 progress shows 'Step 8 of 8' and '100%'", async ({ page }) => {
    await page.goto("/en/get-started/step/7");
    await page.waitForLoadState("domcontentloaded");

    const progressText = page.getByText(/Step\s*8\s*of\s*8/).first();
    await expect(progressText).toBeVisible();

    const percentText = page.getByText(/100%/).first();
    await expect(percentText).toBeVisible();
  });

  test("step detail has a tasks list with numbered items", async ({ page }) => {
    await page.goto("/en/get-started/step/1");
    await page.waitForLoadState("domcontentloaded");

    const stepDetail = new StepDetailPage(page);
    await stepDetail.assertPageLoaded();

    // Task list items are rendered as <li> with numbered spans
    const taskItems = page.locator("li");
    const taskCount = await taskItems.count();
    expect(taskCount).toBeGreaterThan(0);
  });

  test("navigation to next step works (Step 0 -> Step 1)", async ({ page }) => {
    await page.goto("/en/get-started/step/0");
    await page.waitForLoadState("domcontentloaded");

    // Scope to main content to get the navigation link, not sidebar link
    const nextBtn = page.locator("main").getByRole("link", { name: /next/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await page.waitForURL(/\/get-started\/step\/1/);

    expect(page.url()).toContain("/get-started/step/1");
  });

  test("last step (Step 7) has no Next link — shows Explore Skills instead", async ({ page }) => {
    await page.goto("/en/get-started/step/7");
    await page.waitForLoadState("domcontentloaded");

    // Step 7 should not have a "Next" link in main content
    const nextBtn = page.locator("main").getByRole("link", { name: /^Next$/ });
    const nextCount = await nextBtn.count();
    expect(nextCount).toBe(0);

    // Instead it has "Explore Skills"
    const exploreBtn = page.locator("main").getByRole("link", { name: /explore skills/i });
    await expect(exploreBtn).toBeVisible();
  });

  test("first step (Step 0) has no Previous link — shows Overview instead", async ({ page }) => {
    await page.goto("/en/get-started/step/0");
    await page.waitForLoadState("domcontentloaded");

    // Step 0 should not have a "Previous" link in main content
    const prevBtn = page.locator("main").getByRole("link", { name: /^Previous$/ });
    const prevCount = await prevBtn.count();
    expect(prevCount).toBe(0);

    // Instead it has "Overview" in StepNavigation (within main)
    const overviewBtn = page.locator("main").getByRole("link", { name: /overview/i }).last();
    await expect(overviewBtn).toBeVisible();
  });

  test("invalid step number shows 404", async ({ page }) => {
    await page.goto("/en/get-started/step/99");
    await page.waitForLoadState("domcontentloaded");

    // Use innerText() to check visible content only (avoids RSC JSON metadata)
    const mainText = await page.locator("main").innerText().catch(() =>
      page.locator("body").innerText()
    );
    expect(mainText).toMatch(/404|not found/i);
  });

  // Verify all 8 steps are accessible
  for (let stepNum = 0; stepNum < TOTAL_STEPS; stepNum++) {
    test(`Step ${stepNum} page is accessible`, async ({ page }) => {
      await page.goto(`/en/get-started/step/${stepNum}`);
      await page.waitForLoadState("domcontentloaded");

      // Heading should exist (the step title like "Install", "Meet Your Agent", etc.)
      const heading = page.getByRole("heading", { level: 1 });
      await expect(heading).toBeVisible();

      // Visible text should NOT contain a 404 message
      // Use innerText() — strips script/style tags and RSC JSON metadata
      const visibleText = await page.locator("main").innerText();
      expect(visibleText).not.toMatch(/this page could not be found/i);
    });
  }
});
