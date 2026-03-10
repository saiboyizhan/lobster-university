import { describe, it, expect, beforeEach } from "vitest";
import { createApp } from "../src/index";
import { createStore } from "../src/store";
import type { Store } from "../src/store";
import type { Agent, Post, Comment, PaginatedResponse } from "../src/types";
import { resetAgentIdCounter } from "../src/routes/agents";
import { resetPostIdCounters } from "../src/routes/posts";

async function createAgent(
  app: ReturnType<typeof createApp>,
  name: string,
): Promise<Agent> {
  const res = await app.request("/api/agents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

describe("posts API", () => {
  let store: Store;
  let app: ReturnType<typeof createApp>;
  let agent: Agent;

  beforeEach(async () => {
    store = createStore();
    app = createApp(store);
    resetAgentIdCounter();
    resetPostIdCounters();
    agent = await createAgent(app, "PostAuthor");
  });

  describe("POST /api/posts", () => {
    it("should create a post", async () => {
      const res = await app.request("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: agent.id,
          title: "My First Post",
          content: "Hello world",
          tags: ["intro"],
        }),
      });

      expect(res.status).toBe(201);
      const post: Post = await res.json();
      expect(post.title).toBe("My First Post");
      expect(post.authorId).toBe(agent.id);
      expect(post.upvotes).toBe(0);
      expect(post.downvotes).toBe(0);
      expect(post.comments).toEqual([]);
    });

    it("should reject post from unknown agent", async () => {
      const res = await app.request("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: "ghost",
          title: "Nope",
          content: "fail",
        }),
      });

      expect(res.status).toBe(404);
    });

    it("should reject invalid input", async () => {
      const res = await app.request("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: agent.id }),
      });

      expect(res.status).toBe(400);
    });

    it("should award +5 karma for creating a post", async () => {
      await app.request("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: agent.id,
          title: "Karma Post",
          content: "test",
        }),
      });

      const agentRes = await app.request(`/api/agents/${agent.id}`);
      const updated: Agent = await agentRes.json();
      expect(updated.karma).toBe(5);
    });
  });

  describe("GET /api/posts", () => {
    it("should list posts with pagination", async () => {
      for (let i = 0; i < 3; i++) {
        await app.request("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authorId: agent.id,
            title: `Post ${i}`,
            content: `Content ${i}`,
          }),
        });
      }

      const res = await app.request("/api/posts?page=1&limit=2");
      expect(res.status).toBe(200);
      const body: PaginatedResponse<Post> = await res.json();
      expect(body.data).toHaveLength(2);
      expect(body.total).toBe(3);
    });
  });

  describe("GET /api/posts/:id", () => {
    it("should get a post by id", async () => {
      const createRes = await app.request("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: agent.id,
          title: "Find Me",
          content: "Here I am",
        }),
      });
      const created: Post = await createRes.json();

      const res = await app.request(`/api/posts/${created.id}`);
      expect(res.status).toBe(200);
      const post: Post = await res.json();
      expect(post.title).toBe("Find Me");
    });

    it("should return 404 for unknown post", async () => {
      const res = await app.request("/api/posts/nonexistent");
      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/posts/:id/comments", () => {
    it("should add a comment to a post", async () => {
      const postRes = await app.request("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: agent.id,
          title: "Post",
          content: "Content",
        }),
      });
      const post: Post = await postRes.json();

      const commenter = await createAgent(app, "Commenter");
      const res = await app.request(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: commenter.id,
          content: "Great post!",
        }),
      });

      expect(res.status).toBe(201);
      const comment: Comment = await res.json();
      expect(comment.content).toBe("Great post!");
      expect(comment.authorId).toBe(commenter.id);
    });

    it("should award +2 karma for commenting", async () => {
      const postRes = await app.request("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: agent.id,
          title: "Post",
          content: "Content",
        }),
      });
      const post: Post = await postRes.json();

      const commenter = await createAgent(app, "Commenter");
      await app.request(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: commenter.id,
          content: "Nice!",
        }),
      });

      const agentRes = await app.request(`/api/agents/${commenter.id}`);
      const updated: Agent = await agentRes.json();
      expect(updated.karma).toBe(2);
    });

    it("should return 404 for comment on unknown post", async () => {
      const res = await app.request("/api/posts/fake/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: agent.id,
          content: "lost",
        }),
      });
      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/posts/:id/vote", () => {
    it("should upvote a post and award +3 karma to author", async () => {
      const postRes = await app.request("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: agent.id,
          title: "Vote Me",
          content: "Upvote please",
        }),
      });
      const post: Post = await postRes.json();

      const voter = await createAgent(app, "Voter");
      const res = await app.request(`/api/posts/${post.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId: voter.id, direction: "up" }),
      });

      expect(res.status).toBe(200);
      const result = await res.json();
      expect(result.upvotes).toBe(1);

      // Check author karma: 5 (post) + 3 (upvote received) = 8
      const agentRes = await app.request(`/api/agents/${agent.id}`);
      const updated: Agent = await agentRes.json();
      expect(updated.karma).toBe(8);
    });

    it("should downvote a post and subtract -1 karma from author", async () => {
      const postRes = await app.request("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: agent.id,
          title: "Vote Me",
          content: "Downvote me",
        }),
      });
      const post: Post = await postRes.json();

      const voter = await createAgent(app, "Voter");
      const res = await app.request(`/api/posts/${post.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId: voter.id, direction: "down" }),
      });

      expect(res.status).toBe(200);
      const result = await res.json();
      expect(result.downvotes).toBe(1);

      // Check author karma: 5 (post) - 1 (downvote received) = 4
      const agentRes = await app.request(`/api/agents/${agent.id}`);
      const updated: Agent = await agentRes.json();
      expect(updated.karma).toBe(4);
    });

    it("should prevent voting on own post", async () => {
      const postRes = await app.request("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: agent.id,
          title: "Self Vote",
          content: "test",
        }),
      });
      const post: Post = await postRes.json();

      const res = await app.request(`/api/posts/${post.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId: agent.id, direction: "up" }),
      });

      expect(res.status).toBe(400);
    });

    it("should prevent duplicate votes in same direction", async () => {
      const postRes = await app.request("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: agent.id,
          title: "Dupe Vote",
          content: "test",
        }),
      });
      const post: Post = await postRes.json();

      const voter = await createAgent(app, "Voter");
      await app.request(`/api/posts/${post.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId: voter.id, direction: "up" }),
      });

      const res = await app.request(`/api/posts/${post.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId: voter.id, direction: "up" }),
      });

      expect(res.status).toBe(400);
    });

    it("should allow switching vote direction", async () => {
      const postRes = await app.request("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: agent.id,
          title: "Switch Vote",
          content: "test",
        }),
      });
      const post: Post = await postRes.json();

      const voter = await createAgent(app, "Voter");

      await app.request(`/api/posts/${post.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId: voter.id, direction: "up" }),
      });

      const res = await app.request(`/api/posts/${post.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId: voter.id, direction: "down" }),
      });

      expect(res.status).toBe(200);
      const result = await res.json();
      expect(result.upvotes).toBe(0);
      expect(result.downvotes).toBe(1);
    });
  });
});
