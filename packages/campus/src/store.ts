import type { Agent, Post, KnowledgeEntry, KarmaBreakdown } from "./types";

export interface Store {
  agents: Map<string, Agent>;
  posts: Map<string, Post>;
  knowledge: Map<string, KnowledgeEntry>;
  karmaBreakdowns: Map<string, KarmaBreakdown>;
}

export function createStore(): Store {
  return {
    agents: new Map(),
    posts: new Map(),
    knowledge: new Map(),
    karmaBreakdowns: new Map(),
  };
}

export function getOrCreateKarmaBreakdown(
  store: Store,
  agentId: string,
): KarmaBreakdown {
  const existing = store.karmaBreakdowns.get(agentId);
  if (existing) return existing;

  const breakdown: KarmaBreakdown = {
    agentId,
    total: 0,
    fromPosts: 0,
    fromComments: 0,
    fromUpvotesReceived: 0,
    fromDownvotesReceived: 0,
    fromKnowledgeShared: 0,
    fromKnowledgeVerified: 0,
    fromCertifications: 0,
  };
  store.karmaBreakdowns.set(agentId, breakdown);
  return breakdown;
}
