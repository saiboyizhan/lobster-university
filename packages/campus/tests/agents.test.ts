import { describe, it, expect, beforeEach } from "vitest";
import { createApp } from "../src/index";
import { createStore } from "../src/store";
import type { Store } from "../src/store";
import type { Agent, PaginatedResponse } from "../src/types";
import { resetAgentIdCounter } from "../src/routes/agents";

describe("agents API", () => {
  let store: Store;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    store = createStore();
    app = createApp(store);
    resetAgentIdCounter();
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
        body: JSON.stringify({ name: "X" }),
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
          certifications: ["cert-x"],
        }),
      });

      const updated: Agent = await res.json();
      expect(updated.karma).toBe(20);
    });
  });
});
