import { describe, it, expect, beforeEach } from "vitest";
import { createStore } from "../src/store";
import { getOrCreateKarmaBreakdown } from "../src/store";
import type { Store } from "../src/store";
import type { Agent, KarmaBreakdown } from "../src/types";
import { KARMA_VALUES } from "../src/types";
import {
  addPostKarma,
  addCommentKarma,
  addUpvoteKarma,
  addDownvoteKarma,
  addKnowledgeSharedKarma,
  addKnowledgeVerifiedKarma,
  addCertificationKarma,
  getKarmaBreakdown,
  getLeaderboard,
} from "../src/engine/karma";

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

describe("karma engine", () => {
  let store: Store;

  beforeEach(() => {
    store = createStore();
  });

  describe("karma values", () => {
    it("should have correct karma constants", () => {
      expect(KARMA_VALUES.postCreated).toBe(5);
      expect(KARMA_VALUES.comment).toBe(2);
      expect(KARMA_VALUES.upvoteReceived).toBe(3);
      expect(KARMA_VALUES.downvoteReceived).toBe(-1);
      expect(KARMA_VALUES.knowledgeShared).toBe(10);
      expect(KARMA_VALUES.knowledgeVerified).toBe(5);
      expect(KARMA_VALUES.skillCertified).toBe(20);
    });
  });

  describe("addPostKarma", () => {
    it("should add +5 karma for creating a post", () => {
      const agent = createTestAgent(store, "a1", "Bot");
      addPostKarma(store, "a1");

      const breakdown = getKarmaBreakdown(store, "a1");
      expect(breakdown?.fromPosts).toBe(5);
      expect(breakdown?.total).toBe(5);
      expect(agent.karma).toBe(5);
    });

    it("should accumulate across multiple posts", () => {
      createTestAgent(store, "a1", "Bot");
      addPostKarma(store, "a1");
      addPostKarma(store, "a1");
      addPostKarma(store, "a1");

      const breakdown = getKarmaBreakdown(store, "a1");
      expect(breakdown?.fromPosts).toBe(15);
      expect(breakdown?.total).toBe(15);
    });
  });

  describe("addCommentKarma", () => {
    it("should add +2 karma for commenting", () => {
      createTestAgent(store, "a1", "Bot");
      addCommentKarma(store, "a1");

      const breakdown = getKarmaBreakdown(store, "a1");
      expect(breakdown?.fromComments).toBe(2);
      expect(breakdown?.total).toBe(2);
    });
  });

  describe("addUpvoteKarma", () => {
    it("should add +3 karma to post author when upvoted", () => {
      createTestAgent(store, "a1", "Author");
      addUpvoteKarma(store, "a1");

      const breakdown = getKarmaBreakdown(store, "a1");
      expect(breakdown?.fromUpvotesReceived).toBe(3);
      expect(breakdown?.total).toBe(3);
    });
  });

  describe("addDownvoteKarma", () => {
    it("should subtract -1 karma from post author when downvoted", () => {
      createTestAgent(store, "a1", "Author");
      addDownvoteKarma(store, "a1");

      const breakdown = getKarmaBreakdown(store, "a1");
      expect(breakdown?.fromDownvotesReceived).toBe(-1);
      expect(breakdown?.total).toBe(-1);
    });
  });

  describe("addKnowledgeSharedKarma", () => {
    it("should add +10 karma for sharing knowledge", () => {
      createTestAgent(store, "a1", "Bot");
      addKnowledgeSharedKarma(store, "a1");

      const breakdown = getKarmaBreakdown(store, "a1");
      expect(breakdown?.fromKnowledgeShared).toBe(10);
      expect(breakdown?.total).toBe(10);
    });
  });

  describe("addKnowledgeVerifiedKarma", () => {
    it("should add +5 karma when knowledge is verified", () => {
      createTestAgent(store, "a1", "Bot");
      addKnowledgeVerifiedKarma(store, "a1");

      const breakdown = getKarmaBreakdown(store, "a1");
      expect(breakdown?.fromKnowledgeVerified).toBe(5);
      expect(breakdown?.total).toBe(5);
    });
  });

  describe("addCertificationKarma", () => {
    it("should add +20 karma for a certification", () => {
      createTestAgent(store, "a1", "Bot");
      addCertificationKarma(store, "a1");

      const breakdown = getKarmaBreakdown(store, "a1");
      expect(breakdown?.fromCertifications).toBe(20);
      expect(breakdown?.total).toBe(20);
    });
  });

  describe("combined karma", () => {
    it("should correctly sum all karma sources", () => {
      createTestAgent(store, "a1", "Bot");

      addPostKarma(store, "a1"); // +5
      addCommentKarma(store, "a1"); // +2
      addUpvoteKarma(store, "a1"); // +3
      addDownvoteKarma(store, "a1"); // -1
      addKnowledgeSharedKarma(store, "a1"); // +10
      addKnowledgeVerifiedKarma(store, "a1"); // +5
      addCertificationKarma(store, "a1"); // +20

      const breakdown = getKarmaBreakdown(store, "a1");
      expect(breakdown?.total).toBe(44);
      expect(breakdown?.fromPosts).toBe(5);
      expect(breakdown?.fromComments).toBe(2);
      expect(breakdown?.fromUpvotesReceived).toBe(3);
      expect(breakdown?.fromDownvotesReceived).toBe(-1);
      expect(breakdown?.fromKnowledgeShared).toBe(10);
      expect(breakdown?.fromKnowledgeVerified).toBe(5);
      expect(breakdown?.fromCertifications).toBe(20);
    });
  });

  describe("getLeaderboard", () => {
    it("should return agents sorted by karma", () => {
      createTestAgent(store, "a1", "Low");
      createTestAgent(store, "a2", "Mid");
      createTestAgent(store, "a3", "High");

      addPostKarma(store, "a1"); // 5
      addPostKarma(store, "a2");
      addPostKarma(store, "a2"); // 10
      addPostKarma(store, "a3");
      addPostKarma(store, "a3");
      addPostKarma(store, "a3"); // 15

      const board = getLeaderboard(store, 10);
      expect(board).toHaveLength(3);
      expect(board[0].agentId).toBe("a3");
      expect(board[0].karma).toBe(15);
      expect(board[1].agentId).toBe("a2");
      expect(board[2].agentId).toBe("a1");
    });

    it("should respect the limit parameter", () => {
      createTestAgent(store, "a1", "A");
      createTestAgent(store, "a2", "B");
      createTestAgent(store, "a3", "C");

      const board = getLeaderboard(store, 2);
      expect(board).toHaveLength(2);
    });

    it("should return empty for no agents", () => {
      const board = getLeaderboard(store, 10);
      expect(board).toEqual([]);
    });
  });

  describe("getOrCreateKarmaBreakdown", () => {
    it("should create breakdown if it does not exist", () => {
      const breakdown = getOrCreateKarmaBreakdown(store, "new-agent");
      expect(breakdown.agentId).toBe("new-agent");
      expect(breakdown.total).toBe(0);
    });

    it("should return existing breakdown", () => {
      createTestAgent(store, "a1", "Bot");
      addPostKarma(store, "a1");

      const b1 = getOrCreateKarmaBreakdown(store, "a1");
      const b2 = getOrCreateKarmaBreakdown(store, "a1");
      expect(b1).toBe(b2);
      expect(b1.fromPosts).toBe(5);
    });
  });
});
