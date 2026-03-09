import { describe, it, expect } from "vitest";
import {
  searchSkills,
  resolveInstallOrder,
  listByCategory,
  getDependencyTree,
} from "../src/catalog";
import type { SkillCatalog, SkillRegistryEntry } from "../src/types";

// --- Test Fixtures ---

function makeSkill(
  overrides: Partial<SkillRegistryEntry>
): SkillRegistryEntry {
  return {
    name: "@lobster-u/test-skill",
    version: "0.1.0",
    description: "A test skill",
    category: "meta",
    tags: ["test"],
    capabilities: ["testing"],
    triggers: ["test"],
    dependencies: {},
    dependents: [],
    compatibility: { openclaw: ">=0.5.0", claudeCode: ">=1.0.0" },
    npm: "https://www.npmjs.com/package/@lobster-u/test-skill",
    ...overrides,
  };
}

function makeCatalog(skills: SkillRegistryEntry[]): SkillCatalog {
  return {
    version: "0.2.0",
    generatedAt: new Date().toISOString(),
    skills,
    categories: {},
    dependencyGraph: {},
    installGroups: {},
  };
}

const searchSkill = makeSkill({
  name: "@lobster-u/google-search",
  description: "Search query optimization and result ranking",
  category: "information-retrieval",
  tags: ["search", "google", "query"],
  capabilities: ["optimize-search-queries", "rank-results"],
  triggers: ["search", "google", "find information"],
});

const summarizer = makeSkill({
  name: "@lobster-u/summarizer",
  description: "Long-form content summarization",
  category: "content-processing",
  tags: ["summary", "extract", "compress"],
  capabilities: ["summarize-text", "extract-key-points"],
  triggers: ["summarize", "tldr", "key points"],
});

const codeReview = makeSkill({
  name: "@lobster-u/code-review",
  description: "Code quality review and best practice checks",
  category: "code-assistance",
  tags: ["code", "review", "quality"],
  capabilities: ["review-code", "check-best-practices"],
  triggers: ["review code", "check quality"],
});

// --- searchSkills ---

describe("searchSkills", () => {
  const catalog = makeCatalog([searchSkill, summarizer, codeReview]);

  it("returns empty array when no matches", () => {
    const results = searchSkills(catalog, { keyword: "blockchain" });
    expect(results).toHaveLength(0);
  });

  it("matches by keyword in name (weight 5)", () => {
    const results = searchSkills(catalog, { keyword: "google" });
    expect(results).toHaveLength(1);
    expect(results[0].skill.name).toBe("@lobster-u/google-search");
    expect(results[0].relevance).toBeGreaterThanOrEqual(5);
    expect(results[0].matchReasons).toContain("name match");
  });

  it("matches by keyword in description (weight 2)", () => {
    const results = searchSkills(catalog, { keyword: "optimization" });
    expect(results).toHaveLength(1);
    expect(results[0].matchReasons).toContain("description match");
  });

  it("matches by keyword in tags (weight 3)", () => {
    const results = searchSkills(catalog, { keyword: "summary" });
    expect(results).toHaveLength(1);
    expect(results[0].skill.name).toBe("@lobster-u/summarizer");
    expect(results[0].matchReasons).toContain("tag match");
  });

  it("matches by keyword in capabilities (weight 4)", () => {
    const results = searchSkills(catalog, { keyword: "rank-results" });
    expect(results).toHaveLength(1);
    expect(results[0].matchReasons).toContain("capability match");
  });

  it("matches by keyword in triggers (weight 3)", () => {
    const results = searchSkills(catalog, { keyword: "tldr" });
    expect(results).toHaveLength(1);
    expect(results[0].skill.name).toBe("@lobster-u/summarizer");
    expect(results[0].matchReasons).toContain("trigger match");
  });

  it("ranks multi-field matches higher than single-field", () => {
    const results = searchSkills(catalog, { keyword: "search" });
    // "search" matches name + tags + triggers for google-search
    expect(results[0].skill.name).toBe("@lobster-u/google-search");
    expect(results[0].relevance).toBeGreaterThan(5);
  });

  it("filters by category", () => {
    const results = searchSkills(catalog, {
      category: "content-processing",
    });
    expect(results).toHaveLength(1);
    expect(results[0].skill.name).toBe("@lobster-u/summarizer");
  });

  it("combines category filter with keyword", () => {
    const results = searchSkills(catalog, {
      keyword: "search",
      category: "code-assistance",
    });
    // "search" doesn't match code-review
    expect(results).toHaveLength(0);
  });

  it("matches by tags intersection", () => {
    const results = searchSkills(catalog, { tags: ["code", "quality"] });
    expect(results).toHaveLength(1);
    expect(results[0].skill.name).toBe("@lobster-u/code-review");
  });

  it("matches by capabilities intersection", () => {
    const results = searchSkills(catalog, {
      capabilities: ["summarize-text"],
    });
    expect(results).toHaveLength(1);
    expect(results[0].skill.name).toBe("@lobster-u/summarizer");
  });

  it("is case-insensitive", () => {
    const results = searchSkills(catalog, { keyword: "GOOGLE" });
    expect(results).toHaveLength(1);
    expect(results[0].skill.name).toBe("@lobster-u/google-search");
  });
});

// --- resolveInstallOrder ---

describe("resolveInstallOrder", () => {
  const skillA = makeSkill({
    name: "@lobster-u/a",
    dependencies: {},
  });
  const skillB = makeSkill({
    name: "@lobster-u/b",
    dependencies: { "@lobster-u/a": ">=0.1.0" },
  });
  const skillC = makeSkill({
    name: "@lobster-u/c",
    dependencies: { "@lobster-u/b": ">=0.1.0" },
  });

  const catalog = makeCatalog([skillA, skillB, skillC]);

  it("resolves single skill with no deps", () => {
    const plan = resolveInstallOrder(catalog, ["@lobster-u/a"]);
    expect(plan.toInstall).toEqual(["@lobster-u/a"]);
    expect(plan.hasCycle).toBe(false);
  });

  it("resolves deps in correct order (deps before dependents)", () => {
    const plan = resolveInstallOrder(catalog, ["@lobster-u/c"]);
    const idxA = plan.toInstall.indexOf("@lobster-u/a");
    const idxB = plan.toInstall.indexOf("@lobster-u/b");
    const idxC = plan.toInstall.indexOf("@lobster-u/c");
    expect(idxA).toBeLessThan(idxB);
    expect(idxB).toBeLessThan(idxC);
  });

  it("includes transitive dependencies", () => {
    const plan = resolveInstallOrder(catalog, ["@lobster-u/c"]);
    expect(plan.toInstall).toContain("@lobster-u/a");
    expect(plan.toInstall).toContain("@lobster-u/b");
    expect(plan.toInstall).toContain("@lobster-u/c");
  });

  it("skips already installed skills", () => {
    const plan = resolveInstallOrder(catalog, ["@lobster-u/c"], [
      "@lobster-u/a",
    ]);
    expect(plan.toInstall).not.toContain("@lobster-u/a");
    expect(plan.toInstall).toContain("@lobster-u/b");
    expect(plan.installed).toContain("@lobster-u/a");
  });

  it("detects cycles", () => {
    const cycleA = makeSkill({
      name: "@lobster-u/x",
      dependencies: { "@lobster-u/y": ">=0.1.0" },
    });
    const cycleB = makeSkill({
      name: "@lobster-u/y",
      dependencies: { "@lobster-u/x": ">=0.1.0" },
    });
    const cycleCatalog = makeCatalog([cycleA, cycleB]);
    const plan = resolveInstallOrder(cycleCatalog, ["@lobster-u/x"]);
    expect(plan.hasCycle).toBe(true);
  });

  it("handles multiple targets", () => {
    const plan = resolveInstallOrder(catalog, [
      "@lobster-u/a",
      "@lobster-u/c",
    ]);
    expect(plan.toInstall).toContain("@lobster-u/a");
    expect(plan.toInstall).toContain("@lobster-u/b");
    expect(plan.toInstall).toContain("@lobster-u/c");
    expect(plan.targets).toEqual(["@lobster-u/a", "@lobster-u/c"]);
  });
});

// --- listByCategory ---

describe("listByCategory", () => {
  const catalog = makeCatalog([searchSkill, summarizer, codeReview]);

  it("returns all skills when no category specified", () => {
    const results = listByCategory(catalog);
    expect(results).toHaveLength(3);
  });

  it("filters by category", () => {
    const results = listByCategory(catalog, "information-retrieval");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("@lobster-u/google-search");
  });

  it("returns empty for non-matching category", () => {
    const results = listByCategory(catalog, "crypto");
    expect(results).toHaveLength(0);
  });
});

// --- getDependencyTree ---

describe("getDependencyTree", () => {
  const skillA = makeSkill({
    name: "@lobster-u/a",
    dependencies: {},
  });
  const skillB = makeSkill({
    name: "@lobster-u/b",
    dependencies: { "@lobster-u/a": ">=0.1.0" },
  });
  const skillC = makeSkill({
    name: "@lobster-u/c",
    dependencies: { "@lobster-u/a": ">=0.1.0", "@lobster-u/b": ">=0.1.0" },
  });

  const catalog = makeCatalog([skillA, skillB, skillC]);

  it("returns empty deps for leaf skill", () => {
    const tree = getDependencyTree(catalog, "@lobster-u/a");
    expect(tree["@lobster-u/a"]).toEqual([]);
  });

  it("returns direct deps", () => {
    const tree = getDependencyTree(catalog, "@lobster-u/b");
    expect(tree["@lobster-u/b"]).toEqual(["@lobster-u/a"]);
  });

  it("returns full transitive tree", () => {
    const tree = getDependencyTree(catalog, "@lobster-u/c");
    expect(tree["@lobster-u/c"]).toContain("@lobster-u/a");
    expect(tree["@lobster-u/c"]).toContain("@lobster-u/b");
    expect(tree["@lobster-u/b"]).toEqual(["@lobster-u/a"]);
    expect(tree["@lobster-u/a"]).toEqual([]);
  });

  it("returns empty tree for unknown skill", () => {
    const tree = getDependencyTree(catalog, "@lobster-u/unknown");
    expect(tree["@lobster-u/unknown"]).toEqual([]);
  });
});
