import type { Store } from "../store";
import { getOrCreateKarmaBreakdown } from "../store";
import type { KarmaBreakdown } from "../types";
import { KARMA_VALUES } from "../types";

function syncAgentKarma(store: Store, agentId: string): void {
  const breakdown = store.karmaBreakdowns.get(agentId);
  const agent = store.agents.get(agentId);
  if (breakdown && agent) {
    agent.karma = breakdown.total;
  }
}

export function addPostKarma(store: Store, agentId: string): void {
  const breakdown = getOrCreateKarmaBreakdown(store, agentId);
  breakdown.fromPosts += KARMA_VALUES.postCreated;
  breakdown.total += KARMA_VALUES.postCreated;
  syncAgentKarma(store, agentId);
}

export function addCommentKarma(store: Store, agentId: string): void {
  const breakdown = getOrCreateKarmaBreakdown(store, agentId);
  breakdown.fromComments += KARMA_VALUES.comment;
  breakdown.total += KARMA_VALUES.comment;
  syncAgentKarma(store, agentId);
}

export function addUpvoteKarma(store: Store, postAuthorId: string): void {
  const breakdown = getOrCreateKarmaBreakdown(store, postAuthorId);
  breakdown.fromUpvotesReceived += KARMA_VALUES.upvoteReceived;
  breakdown.total += KARMA_VALUES.upvoteReceived;
  syncAgentKarma(store, postAuthorId);
}

export function addDownvoteKarma(store: Store, postAuthorId: string): void {
  const breakdown = getOrCreateKarmaBreakdown(store, postAuthorId);
  breakdown.fromDownvotesReceived += KARMA_VALUES.downvoteReceived;
  breakdown.total += KARMA_VALUES.downvoteReceived;
  syncAgentKarma(store, postAuthorId);
}

export function removeUpvoteKarma(store: Store, postAuthorId: string): void {
  const breakdown = getOrCreateKarmaBreakdown(store, postAuthorId);
  breakdown.fromUpvotesReceived -= KARMA_VALUES.upvoteReceived;
  breakdown.total -= KARMA_VALUES.upvoteReceived;
  syncAgentKarma(store, postAuthorId);
}

export function removeDownvoteKarma(store: Store, postAuthorId: string): void {
  const breakdown = getOrCreateKarmaBreakdown(store, postAuthorId);
  breakdown.fromDownvotesReceived -= KARMA_VALUES.downvoteReceived;
  breakdown.total -= KARMA_VALUES.downvoteReceived;
  syncAgentKarma(store, postAuthorId);
}

export function addKnowledgeSharedKarma(
  store: Store,
  agentId: string,
): void {
  const breakdown = getOrCreateKarmaBreakdown(store, agentId);
  breakdown.fromKnowledgeShared += KARMA_VALUES.knowledgeShared;
  breakdown.total += KARMA_VALUES.knowledgeShared;
  syncAgentKarma(store, agentId);
}

export function addKnowledgeVerifiedKarma(
  store: Store,
  authorId: string,
): void {
  const breakdown = getOrCreateKarmaBreakdown(store, authorId);
  breakdown.fromKnowledgeVerified += KARMA_VALUES.knowledgeVerified;
  breakdown.total += KARMA_VALUES.knowledgeVerified;
  syncAgentKarma(store, authorId);
}

export function addCertificationKarma(
  store: Store,
  agentId: string,
): void {
  const breakdown = getOrCreateKarmaBreakdown(store, agentId);
  breakdown.fromCertifications += KARMA_VALUES.skillCertified;
  breakdown.total += KARMA_VALUES.skillCertified;
  syncAgentKarma(store, agentId);
}

export function getKarmaBreakdown(
  store: Store,
  agentId: string,
): KarmaBreakdown | undefined {
  return store.karmaBreakdowns.get(agentId);
}

export function getLeaderboard(
  store: Store,
  limit: number,
): Array<{ agentId: string; name: string; karma: number }> {
  const agents = Array.from(store.agents.values());
  agents.sort((a, b) => b.karma - a.karma);
  return agents.slice(0, limit).map((a) => ({
    agentId: a.id,
    name: a.name,
    karma: a.karma,
  }));
}
