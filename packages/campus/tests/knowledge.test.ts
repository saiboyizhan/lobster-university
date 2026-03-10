import { describe, it, expect, beforeEach } from "vitest";
import { createStore } from "../src/store";
import type { Store } from "../src/store";
import type { Agent, KnowledgeEntry, KnowledgeGraph } from "../src/types";
import {
  shareKnowledge,
  verifyKnowledge,
  listKnowledge,
  getKnowledge,
  buildKnowledgeGraph,
  resetKnowledgeIdCounter,
} from "../src/engine/knowledge";
import { getKarmaBreakdown } from "../src/engine/karma";

function createTestAgent(store: Store, id: string, name: string): Agent {
  const agent: Agent = {
    id,
    name,
    description: "",
    skills: [],
    karma: 0,
    certifications: [],
    joinedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  };
  store.agents.set(id, agent);
  return agent;
}

describe("knowledge engine", () => {
  let store: Store;

  beforeEach(() => {
    store = createStore();
    resetKnowledgeIdCounter();
  });

  describe("shareKnowledge", () => {
    it("should create a knowledge entry", () => {
      createTestAgent(store, "a1", "Scholar");

      const result = shareKnowledge(store, {
        authorId: "a1",
        title: "How to use Hono",
        content: "Hono is a lightweight web framework...",
        tags: ["hono", "web"],
        relatedSkills: ["@lobster-u/web-dev"],
      });

      expect("error" in result).toBe(false);
      const entry = result as KnowledgeEntry;
      expect(entry.title).toBe("How to use Hono");
      expect(entry.authorId).toBe("a1");
      expect(entry.verifications).toEqual([]);
      expect(entry.relatedSkills).toEqual(["@lobster-u/web-dev"]);
    });

    it("should return error for unknown agent", () => {
      const result = shareKnowledge(store, {
        authorId: "ghost",
        title: "Nope",
        content: "fail",
        tags: [],
        relatedSkills: [],
      });

      expect("error" in result).toBe(true);
      if ("error" in result) {
        expect(result.error).toBe("Agent not found");
      }
    });

    it("should award +10 karma for sharing knowledge", () => {
      createTestAgent(store, "a1", "Scholar");

      shareKnowledge(store, {
        authorId: "a1",
        title: "Learn",
        content: "stuff",
        tags: [],
        relatedSkills: [],
      });

      const breakdown = getKarmaBreakdown(store, "a1");
      expect(breakdown?.fromKnowledgeShared).toBe(10);
      expect(breakdown?.total).toBe(10);
    });

    it("should store knowledge in the store", () => {
      createTestAgent(store, "a1", "Scholar");

      const result = shareKnowledge(store, {
        authorId: "a1",
        title: "Learn",
        content: "stuff",
        tags: [],
        relatedSkills: [],
      });

      expect("error" in result).toBe(false);
      const entry = result as KnowledgeEntry;
      expect(store.knowledge.get(entry.id)).toBe(entry);
    });
  });

  describe("verifyKnowledge", () => {
    it("should allow another agent to verify knowledge", () => {
      createTestAgent(store, "a1", "Author");
      createTestAgent(store, "a2", "Verifier");

      const entry = shareKnowledge(store, {
        authorId: "a1",
        title: "Fact",
        content: "Verified fact",
        tags: [],
        relatedSkills: [],
      }) as KnowledgeEntry;

      const result = verifyKnowledge(store, entry.id, "a2");
      expect("error" in result).toBe(false);
      const verified = result as KnowledgeEntry;
      expect(verified.verifications).toContain("a2");
    });

    it("should award +5 karma to author when verified", () => {
      createTestAgent(store, "a1", "Author");
      createTestAgent(store, "a2", "Verifier");

      const entry = shareKnowledge(store, {
        authorId: "a1",
        title: "Fact",
        content: "Verified",
        tags: [],
        relatedSkills: [],
      }) as KnowledgeEntry;

      verifyKnowledge(store, entry.id, "a2");

      const breakdown = getKarmaBreakdown(store, "a1");
      // 10 (shared) + 5 (verified) = 15
      expect(breakdown?.total).toBe(15);
      expect(breakdown?.fromKnowledgeVerified).toBe(5);
    });

    it("should prevent self-verification", () => {
      createTestAgent(store, "a1", "Author");

      const entry = shareKnowledge(store, {
        authorId: "a1",
        title: "Self",
        content: "self verify",
        tags: [],
        relatedSkills: [],
      }) as KnowledgeEntry;

      const result = verifyKnowledge(store, entry.id, "a1");
      expect("error" in result).toBe(true);
      if ("error" in result) {
        expect(result.error).toBe("Cannot verify your own knowledge");
      }
    });

    it("should prevent duplicate verification", () => {
      createTestAgent(store, "a1", "Author");
      createTestAgent(store, "a2", "Verifier");

      const entry = shareKnowledge(store, {
        authorId: "a1",
        title: "Dupe",
        content: "dupe verify",
        tags: [],
        relatedSkills: [],
      }) as KnowledgeEntry;

      verifyKnowledge(store, entry.id, "a2");
      const result = verifyKnowledge(store, entry.id, "a2");
      expect("error" in result).toBe(true);
      if ("error" in result) {
        expect(result.error).toBe("Already verified by this agent");
      }
    });

    it("should return error for unknown knowledge entry", () => {
      createTestAgent(store, "a1", "Verifier");
      const result = verifyKnowledge(store, "nonexistent", "a1");
      expect("error" in result).toBe(true);
    });

    it("should return error for unknown verifier", () => {
      createTestAgent(store, "a1", "Author");
      const entry = shareKnowledge(store, {
        authorId: "a1",
        title: "Test",
        content: "test",
        tags: [],
        relatedSkills: [],
      }) as KnowledgeEntry;

      const result = verifyKnowledge(store, entry.id, "ghost");
      expect("error" in result).toBe(true);
    });
  });

  describe("listKnowledge", () => {
    it("should list knowledge with pagination", () => {
      createTestAgent(store, "a1", "Author");

      for (let i = 0; i < 5; i++) {
        shareKnowledge(store, {
          authorId: "a1",
          title: `Knowledge ${i}`,
          content: `Content ${i}`,
          tags: [],
          relatedSkills: [],
        });
      }

      const result = listKnowledge(store, 1, 2);
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(5);
      expect(result.totalPages).toBe(3);
    });

    it("should return empty for no entries", () => {
      const result = listKnowledge(store, 1, 20);
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe("getKnowledge", () => {
    it("should retrieve a specific knowledge entry", () => {
      createTestAgent(store, "a1", "Author");
      const entry = shareKnowledge(store, {
        authorId: "a1",
        title: "Find Me",
        content: "Here",
        tags: [],
        relatedSkills: [],
      }) as KnowledgeEntry;

      const found = getKnowledge(store, entry.id);
      expect(found).toBeDefined();
      expect(found?.title).toBe("Find Me");
    });

    it("should return undefined for unknown id", () => {
      const found = getKnowledge(store, "nonexistent");
      expect(found).toBeUndefined();
    });
  });

  describe("buildKnowledgeGraph", () => {
    it("should build a graph from knowledge entries", () => {
      createTestAgent(store, "a1", "Alice");
      createTestAgent(store, "a2", "Bob");

      const entry = shareKnowledge(store, {
        authorId: "a1",
        title: "TypeScript Tips",
        content: "Use strict mode",
        tags: ["typescript"],
        relatedSkills: ["@lobster-u/typescript"],
      }) as KnowledgeEntry;

      verifyKnowledge(store, entry.id, "a2");

      const graph = buildKnowledgeGraph(store);

      // Nodes: a1 (agent), a2 (agent), entry (knowledge), skill (skill)
      expect(graph.nodes).toHaveLength(4);
      expect(graph.nodes.find((n) => n.type === "knowledge")).toBeDefined();
      expect(graph.nodes.filter((n) => n.type === "agent")).toHaveLength(2);
      expect(graph.nodes.find((n) => n.type === "skill")).toBeDefined();

      // Edges: authored, verified, related_skill
      expect(graph.edges).toHaveLength(3);
      expect(
        graph.edges.find((e) => e.relation === "authored"),
      ).toBeDefined();
      expect(
        graph.edges.find((e) => e.relation === "verified"),
      ).toBeDefined();
      expect(
        graph.edges.find((e) => e.relation === "related_skill"),
      ).toBeDefined();
    });

    it("should return empty graph when no knowledge exists", () => {
      const graph = buildKnowledgeGraph(store);
      expect(graph.nodes).toEqual([]);
      expect(graph.edges).toEqual([]);
    });

    it("should not duplicate agent nodes", () => {
      createTestAgent(store, "a1", "Alice");

      shareKnowledge(store, {
        authorId: "a1",
        title: "K1",
        content: "c1",
        tags: [],
        relatedSkills: [],
      });

      shareKnowledge(store, {
        authorId: "a1",
        title: "K2",
        content: "c2",
        tags: [],
        relatedSkills: [],
      });

      const graph = buildKnowledgeGraph(store);
      const agentNodes = graph.nodes.filter((n) => n.type === "agent");
      expect(agentNodes).toHaveLength(1);
    });
  });
});
