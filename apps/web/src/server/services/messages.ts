import { eq, or, and, desc, isNull, sql, count } from "drizzle-orm";
import { db } from "../db";
import { messages, agents } from "../db/schema";
import { randomUUID } from "crypto";

export async function sendMessage(senderId: string, receiverId: string, content: string) {
  const id = randomUUID();
  await db.insert(messages).values({
    id,
    senderId,
    receiverId,
    content,
    createdAt: new Date(),
  });
  return { id };
}

export async function getConversation(agentId: string, otherAgentId: string, limit = 50) {
  return db
    .select({
      id: messages.id,
      senderId: messages.senderId,
      receiverId: messages.receiverId,
      content: messages.content,
      readAt: messages.readAt,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .where(
      or(
        and(eq(messages.senderId, agentId), eq(messages.receiverId, otherAgentId)),
        and(eq(messages.senderId, otherAgentId), eq(messages.receiverId, agentId)),
      ),
    )
    .orderBy(desc(messages.createdAt))
    .limit(limit);
}

export async function listConversations(agentId: string) {
  // Get distinct conversation partners with latest message
  const sent = db
    .select({
      partnerId: messages.receiverId,
      lastMessageAt: sql<number>`max(${messages.createdAt})`.as("last_msg"),
    })
    .from(messages)
    .where(eq(messages.senderId, agentId))
    .groupBy(messages.receiverId);

  const received = db
    .select({
      partnerId: messages.senderId,
      lastMessageAt: sql<number>`max(${messages.createdAt})`.as("last_msg"),
    })
    .from(messages)
    .where(eq(messages.receiverId, agentId))
    .groupBy(messages.senderId);

  // Union and get latest
  const allPartners = new Map<string, number>();

  for (const row of await sent) {
    allPartners.set(row.partnerId, row.lastMessageAt);
  }
  for (const row of await received) {
    const existing = allPartners.get(row.partnerId) ?? 0;
    if (row.lastMessageAt > existing) {
      allPartners.set(row.partnerId, row.lastMessageAt);
    }
  }

  // Fetch agent names and sort by latest message
  const partnerIds = [...allPartners.keys()];
  if (partnerIds.length === 0) return [];

  const agentRows = await db
    .select({ id: agents.id, name: agents.name })
    .from(agents)
    .where(sql`${agents.id} IN (${sql.join(partnerIds.map((id) => sql`${id}`), sql`, `)})`);

  const agentMap = new Map(agentRows.map((a) => [a.id, a.name]));

  return partnerIds
    .map((partnerId) => ({
      partnerId,
      partnerName: agentMap.get(partnerId) ?? "Unknown",
      lastMessageAt: allPartners.get(partnerId) ?? 0,
    }))
    .sort((a, b) => b.lastMessageAt - a.lastMessageAt);
}

export async function markAsRead(agentId: string, senderId: string) {
  await db
    .update(messages)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(messages.receiverId, agentId),
        eq(messages.senderId, senderId),
        isNull(messages.readAt),
      ),
    );
}

export async function getUnreadCount(agentId: string): Promise<number> {
  const rows = await db
    .select({ count: count() })
    .from(messages)
    .where(and(eq(messages.receiverId, agentId), isNull(messages.readAt)));
  return rows[0]?.count ?? 0;
}
