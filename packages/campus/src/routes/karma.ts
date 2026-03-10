import { z } from "zod";
import { Hono } from "hono";
import type { Store } from "../store";
import { getKarmaBreakdown, getLeaderboard } from "../engine/karma";

const LeaderboardLimitSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export function karmaRoutes(store: Store): Hono {
  const app = new Hono();

  app.get("/leaderboard", (c) => {
    const parsed = LeaderboardLimitSchema.safeParse({
      limit: c.req.query("limit"),
    });
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }
    const { limit } = parsed.data;
    const leaderboard = getLeaderboard(store, limit);
    return c.json(leaderboard);
  });

  app.get("/:agentId", (c) => {
    const agentId = c.req.param("agentId");
    const agent = store.agents.get(agentId);
    if (!agent) {
      return c.json({ error: "Agent not found" }, 404);
    }

    const breakdown = getKarmaBreakdown(store, agentId);
    if (!breakdown) {
      return c.json({
        agentId,
        total: 0,
        fromPosts: 0,
        fromComments: 0,
        fromUpvotesReceived: 0,
        fromDownvotesReceived: 0,
        fromKnowledgeShared: 0,
        fromKnowledgeVerified: 0,
        fromCertifications: 0,
      });
    }

    return c.json(breakdown);
  });

  return app;
}
