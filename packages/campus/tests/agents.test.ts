import { describe, it, expect, beforeEach } from "vitest";
import { createApp } from "../src/index";
import { createStore } from "../src/store";
import type { Store } from "../src/store";
import type { Agent, PaginatedResponse } from "../src/types";

describe("agents API", () => {
  let store: Store;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    store = createStore();
    app = createApp(store);
  });

  describe("POST /api/agents", () => {
    it("should register a new agent", async () => {
      const res = await app.request("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "TestBot",
          description: "A test agent",
          skills: ["@lobster-u/google-search"],
        }),
      });

      expect(res.status).toBe(201);
      const agent: Agent = await res.json();
      expect(agent.name).toBe("TestBot");
      expect(agent.description).toBe("A test agent");
      expect(agent.skills).toEqual(["@lobster-u/google-search"]);
      expect(agent.karma).toBe(0);
      expect(agent.id).toBeDefined();
      expect(agent.joinedAt).toBeDefined();
    });

    it("should reject invalid input (missing name)", async () => {
      const res = await app.request("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: "no name" }),
      });

      expect(res.status).toBe(400);
    });

    it("should default empty fields", async () => {
      const res = await app.request("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "MinimalBot" }),
      });

      expect(res.status).toBe(201);
      const agent: Agent = await res.json();
      expect(agent.description).toBe("");
      expect(agent.skills).toEqual([]);
      expect(agent.certifications).toEqual([]);
    });

    it("should award karma for certifications on creation", async () => {
      const res = await app.request("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "CertBot",
          certifications: ["cert-a", "cert-b"],
        }),
      });

      expect(res.status).toBe(201);
      const agent: Agent = await res.json();
      expect(agent.karma).toBe(40); // 2 certs * 20 karma
    });
  });

  describe("GET /api/agents/:id", () => {
    it("should return an agent by id", async () => {
      const createRes = await app.request("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "FindMe" }),
      });
      const created: Agent = await createRes.json();

      const res = await app.request(`/api/agents/${created.id}`);
      expect(res.status).toBe(200);
      const agent: Agent = await res.json();
      expect(agent.name).toBe("FindMe");
    });

    it("should return 404 for unknown agent", async () => {
      const res = await app.request("/api/agents/nonexistent");
      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/agents", () => {
    it("should list agents with pagination", async () => {
      for (let i = 0; i < 5; i++) {
        await app.request("/api/agents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: `Bot-${i}` }),
        });
      }

      const res = await app.request("/api/agents?page=1&limit=2");
      expect(res.status).toBe(200);
      const body: PaginatedResponse<Agent> = await res.json();
      expect(body.data).toHaveLength(2);
      expect(body.total).toBe(5);
      expect(body.totalPages).toBe(3);
      expect(body.page).toBe(1);
    });

    it("should default pagination values", async () => {
      await app.request("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Solo" }),
      });

      const res = await app.request("/api/agents");
      expect(res.status).toBe(200);
      const body: PaginatedResponse<Agent> = await res.json();
      expect(body.page).toBe(1);
      expect(body.limit).toBe(20);
    });
  });

  describe("PATCH /api/agents/:id", () => {
    it("should update agent fields", async () => {
      const createRes = await app.request("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "OldName" }),
      });
      const created: Agent = await createRes.json();

      const res = await app.request(`/api/agents/${created.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterId: created.id,
          name: "NewName",
          skills: ["@lobster-u/deep-research"],
        }),
      });

      expect(res.status).toBe(200);
      const updated: Agent = await res.json();
      expect(updated.name).toBe("NewName");
      expect(updated.skills).toEqual(["@lobster-u/deep-research"]);
    });

    it("should return 404 for unknown agent", async () => {
      const res = await app.request("/api/agents/nonexistent", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterId: "nonexistent", name: "X" }),
      });
      expect(res.status).toBe(404);
    });

    it("should award karma for new certifications added via update", async () => {
      const createRes = await app.request("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "CertBot" }),
      });
      const created: Agent = await createRes.json();
      expect(created.karma).toBe(0);

      const res = await app.request(`/api/agents/${created.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterId: created.id,
          certifications: ["cert-x"],
        }),
      });

      const updated: Agent = await res.json();
      expect(updated.karma).toBe(20);
    });

    // CRITICAL-3: Authorization on PATCH
    it("should reject PATCH when requesterId doesn't match agent id", async () => {
      const createRes = await app.request("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "TargetBot" }),
      });
      const created: Agent = await createRes.json();

      const res = await app.request(`/api/agents/${created.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterId: "some-other-agent",
          name: "Hacked",
        }),
      });

      expect(res.status).toBe(403);
    });

    it("should succeed PATCH when requesterId matches", async () => {
      const createRes = await app.request("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "MyBot" }),
      });
      const created: Agent = await createRes.json();

      const res = await app.request(`/api/agents/${created.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterId: created.id,
          name: "UpdatedBot",
        }),
      });

      expect(res.status).toBe(200);
      const updated: Agent = await res.json();
      expect(updated.name).toBe("UpdatedBot");
    });

    // HIGH-4: Certification re-add karma exploit
    it("should not re-award karma when removing and re-adding certification", async () => {
      const createRes = await app.request("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "ExploitBot",
          certifications: ["cert-a"],
        }),
      });
      const created: Agent = await createRes.json();
      expect(created.karma).toBe(20); // 1 cert * 20

      // Remove certification
      const removeRes = await app.request(`/api/agents/${created.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterId: created.id,
          certifications: [],
        }),
      });
      const removed: Agent = await removeRes.json();
      expect(removed.certifications).toEqual([]);

      // Re-add certification — should NOT get additional karma
      const readdRes = await app.request(`/api/agents/${created.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterId: created.id,
          certifications: ["cert-a"],
        }),
      });
      const readded: Agent = await readdRes.json();
      expect(readded.certifications).toEqual(["cert-a"]);
      expect(readded.karma).toBe(20); // Still 20, not 40
    });
  });

  // CRITICAL-1: UUID IDs
  describe("UUID IDs", () => {
    it("should generate non-sequential UUID for agent IDs", async () => {
      const res1 = await app.request("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Agent1" }),
      });
      const agent1: Agent = await res1.json();

      const res2 = await app.request("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Agent2" }),
      });
      const agent2: Agent = await res2.json();

      // Should be UUID format, not sequential like agent-1, agent-2
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
      expect(agent1.id).toMatch(uuidRegex);
      expect(agent2.id).toMatch(uuidRegex);
      expect(agent1.id).not.toBe(agent2.id);
    });
  });
});
