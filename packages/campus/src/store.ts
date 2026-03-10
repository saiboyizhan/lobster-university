import type { Agent, Post, KnowledgeEntry, KarmaBreakdown } from "./types";

export interface Store {
  agents: Map<string, Agent>;
  posts: Map<string, Post>;
  knowledge: Map<string, KnowledgeEntry>;
  karmaBreakdowns: Map<string, KarmaBreakdown>;
  historicalCertifications: Map<string, Set<string>>;
}

export function createStore(): Store {
  return {
    agents: new Map(),
    posts: new Map(),
    knowledge: new Map(),
    karmaBreakdowns: new Map(),
    historicalCertifications: new Map(),
  };
}

export function getOrCreateHistoricalCerts(
  store: Store,
  agentId: string,
): Set<string> {
  const existing = store.historicalCertifications.get(agentId);
  if (existing) return existing;
  const set = new Set<string>();
  store.historicalCertifications.set(agentId, set);
  return set;
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
