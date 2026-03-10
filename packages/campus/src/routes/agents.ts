import crypto from "node:crypto";
import { Hono } from "hono";
import type { Store } from "../store";
import { getOrCreateHistoricalCerts } from "../store";
import {
  CreateAgentSchema,
  UpdateAgentSchema,
  PaginationSchema,
} from "../types";
import type { Agent, PaginatedResponse } from "../types";
import { addCertificationKarma } from "../engine/karma";

export function agentRoutes(store: Store): Hono {
  const app = new Hono();

  app.post("/", async (c) => {
    const body = await c.req.json();
    const parsed = CreateAgentSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const input = parsed.data;
    const now = new Date().toISOString();
    const agent: Agent = {
      id: crypto.randomUUID(),
      name: input.name,
      description: input.description,
      skills: input.skills,
      karma: 0,
      certifications: input.certifications,
      joinedAt: now,
      lastActiveAt: now,
    };

    store.agents.set(agent.id, agent);

    if (agent.certifications.length > 0) {
      const historical = getOrCreateHistoricalCerts(store, agent.id);
      for (const cert of agent.certifications) {
        if (!historical.has(cert)) {
          historical.add(cert);
          addCertificationKarma(store, agent.id);
        }
      }
    }
    return c.json(agent, 201);
  });

  app.get("/:id", (c) => {
    const id = c.req.param("id");
    const agent = store.agents.get(id);
    if (!agent) {
      return c.json({ error: "Agent not found" }, 404);
    }
    return c.json(agent);
  });

  app.get("/", (c) => {
    const query = PaginationSchema.safeParse({
      page: c.req.query("page"),
      limit: c.req.query("limit"),
    });

    const { page, limit } = query.success
      ? query.data
      : { page: 1, limit: 20 };

    const all = Array.from(store.agents.values());
    all.sort(
      (a, b) =>
        new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime(),
    );

    const total = all.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = all.slice(start, start + limit);

    const response: PaginatedResponse<Agent> = {
      data,
      total,
      page,
      limit,
      totalPages,
    };
    return c.json(response);
  });

  app.patch("/:id", async (c) => {
    const id = c.req.param("id");
    const agent = store.agents.get(id);
    if (!agent) {
      return c.json({ error: "Agent not found" }, 404);
    }

    const body = await c.req.json();
    const parsed = UpdateAgentSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const input = parsed.data;

    if (input.requesterId !== id) {
      return c.json({ error: "Forbidden: requesterId must match agent id" }, 403);
    }

    if (input.name !== undefined) agent.name = input.name;
    if (input.description !== undefined) agent.description = input.description;
    if (input.skills !== undefined) agent.skills = input.skills;
    if (input.certifications !== undefined) {
      const historical = getOrCreateHistoricalCerts(store, agent.id);
      const newCerts = input.certifications.filter(
        (cert) => !historical.has(cert),
      );
      agent.certifications = input.certifications;
      for (const cert of newCerts) {
        historical.add(cert);
        addCertificationKarma(store, agent.id);
      }
    }

    agent.lastActiveAt = new Date().toISOString();
    return c.json(agent);
  });

  return app;
}
