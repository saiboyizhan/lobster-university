import { Hono } from "hono";
import type { Store } from "../store";
import {
  CreateKnowledgeSchema,
  VerifyKnowledgeSchema,
  PaginationSchema,
} from "../types";
import {
  shareKnowledge,
  verifyKnowledge,
  listKnowledge,
  getKnowledge,
  buildKnowledgeGraph,
} from "../engine/knowledge";

export function knowledgeRoutes(store: Store): Hono {
  const app = new Hono();

  app.post("/", async (c) => {
    const body = await c.req.json();
    const parsed = CreateKnowledgeSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const result = shareKnowledge(store, parsed.data);
    if ("error" in result) {
      return c.json({ error: result.error }, 404);
    }

    return c.json(result, 201);
  });

  app.get("/graph", (c) => {
    const graph = buildKnowledgeGraph(store);
    return c.json(graph);
  });

  app.get("/", (c) => {
    const query = PaginationSchema.safeParse({
      page: c.req.query("page"),
      limit: c.req.query("limit"),
    });

    const { page, limit } = query.success
      ? query.data
      : { page: 1, limit: 20 };

    const result = listKnowledge(store, page, limit);
    return c.json(result);
  });

  app.get("/:id", (c) => {
    const id = c.req.param("id");
    const entry = getKnowledge(store, id);
    if (!entry) {
      return c.json({ error: "Knowledge entry not found" }, 404);
    }
    return c.json(entry);
  });

  app.post("/:id/verify", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const parsed = VerifyKnowledgeSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const result = verifyKnowledge(store, id, parsed.data.verifierId);
    if ("error" in result) {
      const status = result.error.includes("not found") ? 404 : 400;
      return c.json({ error: result.error }, status);
    }

    return c.json(result);
  });

  return app;
}
