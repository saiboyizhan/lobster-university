import { eq, desc, sql } from "drizzle-orm";
import { db } from "../db";
import { knowledge, verifications, agents, karmaBreakdown } from "../db/schema";

const KARMA_KNOWLEDGE_SHARED = 10;
const KARMA_KNOWLEDGE_VERIFIED = 5;

export async function shareKnowledge(data: {
  id: string;
  authorId: string;
  title: string;
  content: string;
  tags: string[];
  relatedSkills: string[];
}) {
  await db.insert(knowledge).values({
    id: data.id,
    authorId: data.authorId,
    title: data.title,
    content: data.content,
    tags: data.tags,
    relatedSkills: data.relatedSkills,
    createdAt: new Date(),
  });

  await db
    .update(karmaBreakdown)
    .set({
      fromKnowledgeShared: sql`${karmaBreakdown.fromKnowledgeShared} + ${KARMA_KNOWLEDGE_SHARED}`,
      total: sql`${karmaBreakdown.total} + ${KARMA_KNOWLEDGE_SHARED}`,
    })
    .where(eq(karmaBreakdown.agentId, data.authorId));

  await db
    .update(agents)
    .set({ karma: sql`${agents.karma} + ${KARMA_KNOWLEDGE_SHARED}` })
    .where(eq(agents.id, data.authorId));
}

export async function verifyKnowledge(data: {
  knowledgeId: string;
  verifierId: string;
}) {
  const entry = await db.select().from(knowledge).where(eq(knowledge.id, data.knowledgeId)).limit(1);
  if (!entry[0] || entry[0].authorId === data.verifierId) return;

  await db.insert(verifications).values({
    knowledgeId: data.knowledgeId,
    verifierId: data.verifierId,
  });

  await db
    .update(karmaBreakdown)
    .set({
      fromKnowledgeVerified: sql`${karmaBreakdown.fromKnowledgeVerified} + ${KARMA_KNOWLEDGE_VERIFIED}`,
      total: sql`${karmaBreakdown.total} + ${KARMA_KNOWLEDGE_VERIFIED}`,
    })
    .where(eq(karmaBreakdown.agentId, entry[0].authorId));

  await db
    .update(agents)
    .set({ karma: sql`${agents.karma} + ${KARMA_KNOWLEDGE_VERIFIED}` })
    .where(eq(agents.id, entry[0].authorId));
}

export async function listKnowledge(opts: { limit?: number; offset?: number }) {
  return db
    .select()
    .from(knowledge)
    .orderBy(desc(knowledge.createdAt))
    .limit(opts.limit ?? 20)
    .offset(opts.offset ?? 0);
}

export async function getKnowledgeEntry(id: string) {
  const result = await db.select().from(knowledge).where(eq(knowledge.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getKnowledgeVerifications(knowledgeId: string) {
  return db.select().from(verifications).where(eq(verifications.knowledgeId, knowledgeId));
}

export async function buildKnowledgeGraph() {
  const allKnowledge = await db.select().from(knowledge);
  const allVerifications = await db.select().from(verifications);
  const allAgents = await db.select().from(agents);

  const nodes: { id: string; type: string; label: string }[] = [];
  const edges: { source: string; target: string; type: string }[] = [];

  for (const a of allAgents) {
    nodes.push({ id: `agent-${a.id}`, type: "agent", label: a.name });
  }

  for (const k of allKnowledge) {
    nodes.push({ id: `knowledge-${k.id}`, type: "knowledge", label: k.title });
    edges.push({ source: `agent-${k.authorId}`, target: `knowledge-${k.id}`, type: "authored" });

    const relatedSkills = k.relatedSkills as string[];
    for (const skill of relatedSkills) {
      const skillNodeId = `skill-${skill}`;
      if (!nodes.find((n) => n.id === skillNodeId)) {
        nodes.push({ id: skillNodeId, type: "skill", label: skill });
      }
      edges.push({ source: `knowledge-${k.id}`, target: skillNodeId, type: "related_skill" });
    }
  }

  for (const v of allVerifications) {
    edges.push({ source: `agent-${v.verifierId}`, target: `knowledge-${v.knowledgeId}`, type: "verified" });
  }

  return { nodes, edges };
}
