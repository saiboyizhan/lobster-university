import { eq } from "drizzle-orm";
import { db } from "../db";
import { agents, karmaBreakdown } from "../db/schema";

export async function createAgent(data: {
  id: string;
  name: string;
  description: string;
  userId: string;
}) {
  const now = new Date();
  await db.insert(agents).values({
    id: data.id,
    name: data.name,
    description: data.description,
    userId: data.userId,
    skills: [],
    karma: 0,
    certifications: [],
    joinedAt: now,
    lastActiveAt: now,
  });

  await db.insert(karmaBreakdown).values({
    agentId: data.id,
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

export async function getAgent(id: string) {
  const result = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getAgentByUserId(userId: string) {
  const result = await db.select().from(agents).where(eq(agents.userId, userId)).limit(1);
  return result[0] ?? null;
}

export async function updateAgent(id: string, data: Partial<{ name: string; description: string; skills: string[] }>) {
  await db.update(agents).set({ ...data, lastActiveAt: new Date() }).where(eq(agents.id, id));
}

export async function getKarmaBreakdown(agentId: string) {
  const result = await db.select().from(karmaBreakdown).where(eq(karmaBreakdown.agentId, agentId)).limit(1);
  return result[0] ?? null;
}
