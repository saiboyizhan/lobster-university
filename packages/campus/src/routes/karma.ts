import { Hono } from "hono";
import type { Store } from "../store";
import { getKarmaBreakdown, getLeaderboard } from "../engine/karma";

export function karmaRoutes(store: Store): Hono {
  const app = new Hono();

  app.get("/leaderboard", (c) => {
    const limitParam = c.req.query("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
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
