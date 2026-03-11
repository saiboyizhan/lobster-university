import { describe, it, expect } from "vitest";
import {
  getAllSkills,
  getSkillBySlug,
  getCategories,
  filterSkills,
  type Skill,
} from "./skills";

describe("skills data module", () => {
  describe("getAllSkills", () => {
    it("returns all skills from manifest files", () => {
      const skills = getAllSkills();
      expect(skills.length).toBeGreaterThanOrEqual(33);
      expect(skills[0]).toHaveProperty("name");
      expect(skills[0]).toHaveProperty("description");
      expect(skills[0]).toHaveProperty("category");
      expect(skills[0]).toHaveProperty("tags");
    });

    it("strips @lobster-u/ prefix from name for slug", () => {
      const skills = getAllSkills();
      const skill = skills.find((s) => s.slug === "google-search");
      expect(skill).toBeDefined();
      expect(skill!.name).toBe("@lobster-u/google-search");
    });
  });

  describe("getSkillBySlug", () => {
    it("returns a skill by slug", () => {
      const skill = getSkillBySlug("google-search");
      expect(skill).toBeDefined();
      expect(skill!.category).toBe("information-retrieval");
    });

    it("returns undefined for unknown skill", () => {
      const skill = getSkillBySlug("nonexistent-skill");
      expect(skill).toBeUndefined();
    });
  });

  describe("getCategories", () => {
    it("returns unique category list", () => {
      const categories = getCategories();
      expect(categories.length).toBeGreaterThanOrEqual(6);
      expect(categories).toContain("information-retrieval");
      expect(categories).toContain("crypto");
      expect(categories).toContain("code-assistance");
    });
  });

  describe("filterSkills", () => {
    it("filters by category", () => {
      const results = filterSkills({ category: "crypto" });
      expect(results.length).toBe(5);
      results.forEach((s) => expect(s.category).toBe("crypto"));
    });

    it("filters by search query (matches name)", () => {
      const results = filterSkills({ query: "google" });
      expect(results.some((s) => s.slug === "google-search")).toBe(true);
    });

    it("filters by search query (matches description)", () => {
      const results = filterSkills({ query: "whale" });
      expect(results.length).toBeGreaterThan(0);
    });

    it("filters by both category and query", () => {
      const results = filterSkills({ category: "crypto", query: "whale" });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((s) => expect(s.category).toBe("crypto"));
    });

    it("returns all skills with no filters", () => {
      const all = getAllSkills();
      const results = filterSkills({});
      expect(results.length).toBe(all.length);
    });
  });
});
