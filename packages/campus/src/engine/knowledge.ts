import type { Store } from "../store";
import type {
  KnowledgeEntry,
  KnowledgeGraph,
  KnowledgeGraphNode,
  KnowledgeGraphEdge,
  PaginatedResponse,
} from "../types";
import { addKnowledgeSharedKarma, addKnowledgeVerifiedKarma } from "./karma";

let nextId = 1;

function generateKnowledgeId(): string {
  return `knowledge-${nextId++}`;
}

export function resetKnowledgeIdCounter(): void {
  nextId = 1;
}

export function shareKnowledge(
  store: Store,
  input: {
    authorId: string;
    title: string;
    content: string;
    tags: string[];
    relatedSkills: string[];
  },
): KnowledgeEntry | { error: string } {
  const agent = store.agents.get(input.authorId);
  if (!agent) {
    return { error: "Agent not found" };
  }

  const entry: KnowledgeEntry = {
    id: generateKnowledgeId(),
    authorId: input.authorId,
    title: input.title,
    content: input.content,
    tags: input.tags,
    verifications: [],
    relatedSkills: input.relatedSkills,
    createdAt: new Date().toISOString(),
  };

  store.knowledge.set(entry.id, entry);
  addKnowledgeSharedKarma(store, input.authorId);
  agent.lastActiveAt = new Date().toISOString();

  return entry;
}

export function verifyKnowledge(
  store: Store,
  knowledgeId: string,
  verifierId: string,
): KnowledgeEntry | { error: string } {
  const entry = store.knowledge.get(knowledgeId);
  if (!entry) {
    return { error: "Knowledge entry not found" };
  }

  const verifier = store.agents.get(verifierId);
  if (!verifier) {
    return { error: "Verifier agent not found" };
  }

  if (entry.authorId === verifierId) {
    return { error: "Cannot verify your own knowledge" };
  }

  if (entry.verifications.includes(verifierId)) {
    return { error: "Already verified by this agent" };
  }

  entry.verifications.push(verifierId);
  addKnowledgeVerifiedKarma(store, entry.authorId);

  return entry;
}

export function listKnowledge(
  store: Store,
  page: number,
  limit: number,
): PaginatedResponse<KnowledgeEntry> {
  const all = Array.from(store.knowledge.values());
  all.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const total = all.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);

  return { data, total, page, limit, totalPages };
}

export function getKnowledge(
  store: Store,
  id: string,
): KnowledgeEntry | undefined {
  return store.knowledge.get(id);
}

export function buildKnowledgeGraph(store: Store): KnowledgeGraph {
  const nodes: KnowledgeGraphNode[] = [];
  const edges: KnowledgeGraphEdge[] = [];
  const nodeIds = new Set<string>();

  for (const entry of store.knowledge.values()) {
    if (!nodeIds.has(entry.id)) {
      nodes.push({ id: entry.id, label: entry.title, type: "knowledge" });
      nodeIds.add(entry.id);
    }

    if (!nodeIds.has(entry.authorId)) {
      const agent = store.agents.get(entry.authorId);
      nodes.push({
        id: entry.authorId,
        label: agent?.name ?? entry.authorId,
        type: "agent",
      });
      nodeIds.add(entry.authorId);
    }

    edges.push({
      source: entry.authorId,
      target: entry.id,
      relation: "authored",
    });

    for (const verifierId of entry.verifications) {
      if (!nodeIds.has(verifierId)) {
        const agent = store.agents.get(verifierId);
        nodes.push({
          id: verifierId,
          label: agent?.name ?? verifierId,
          type: "agent",
        });
        nodeIds.add(verifierId);
      }
      edges.push({
        source: verifierId,
        target: entry.id,
        relation: "verified",
      });
    }

    for (const skill of entry.relatedSkills) {
      if (!nodeIds.has(skill)) {
        nodes.push({ id: skill, label: skill, type: "skill" });
        nodeIds.add(skill);
      }
      edges.push({
        source: entry.id,
        target: skill,
        relation: "related_skill",
      });
    }
  }

  return { nodes, edges };
}
