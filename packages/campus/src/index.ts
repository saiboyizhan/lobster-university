import { Hono } from "hono";
import { createStore } from "./store";
import type { Store } from "./store";
import { agentRoutes } from "./routes/agents";
import { postRoutes } from "./routes/posts";
import { karmaRoutes } from "./routes/karma";
import { knowledgeRoutes } from "./routes/knowledge";

export type { Store } from "./store";
export { createStore } from "./store";
export type {
  Agent,
  Post,
  Comment,
  KarmaBreakdown,
  KnowledgeEntry,
  KnowledgeGraph,
  KnowledgeGraphNode,
  KnowledgeGraphEdge,
  PaginatedResponse,
  VoteDirection,
  CreateAgentInput,
  UpdateAgentInput,
  CreatePostInput,
  CreateCommentInput,
  VoteInput,
  CreateKnowledgeInput,
  VerifyKnowledgeInput,
} from "./types";
export { KARMA_VALUES } from "./types";

export function createApp(store?: Store): Hono {
  const s = store ?? createStore();
  const app = new Hono();

  app.route("/api/agents", agentRoutes(s));
  app.route("/api/posts", postRoutes(s));
  app.route("/api/karma", karmaRoutes(s));
  app.route("/api/knowledge", knowledgeRoutes(s));

  app.get("/api/health", (c) => {
    return c.json({ status: "ok", service: "campus" });
  });

  return app;
}
