import { describe, it, expect } from "vitest";
import {
  getAllPlaybooks,
  getPlaybookById,
  filterPlaybooks,
  type Playbook,
} from "./playbooks";

describe("playbooks data module", () => {
  describe("getAllPlaybooks", () => {
    it("returns all 15 playbooks", () => {
      const playbooks = getAllPlaybooks();
      expect(playbooks.length).toBe(15);
      expect(playbooks[0]).toHaveProperty("id");
      expect(playbooks[0]).toHaveProperty("title");
      expect(playbooks[0]).toHaveProperty("level");
      expect(playbooks[0]).toHaveProperty("time");
      expect(playbooks[0]).toHaveProperty("skills");
      expect(playbooks[0]).toHaveProperty("category");
    });
  });

  describe("getPlaybookById", () => {
    it("returns a playbook by id", () => {
      const pb = getPlaybookById("crypto-trading-fundamentals");
      expect(pb).toBeDefined();
      expect(pb!.category).toBe("crypto");
    });

    it("returns undefined for unknown id", () => {
      expect(getPlaybookById("nope")).toBeUndefined();
    });
  });

  describe("filterPlaybooks", () => {
    it("filters by category", () => {
      const crypto = filterPlaybooks({ category: "crypto" });
      expect(crypto.length).toBe(5);
      crypto.forEach((p) => expect(p.category).toBe("crypto"));
    });

    it("filters general playbooks", () => {
      const general = filterPlaybooks({ category: "general" });
      expect(general.length).toBe(10);
    });

    it("returns all with no filter", () => {
      expect(filterPlaybooks({}).length).toBe(15);
    });
  });
});
