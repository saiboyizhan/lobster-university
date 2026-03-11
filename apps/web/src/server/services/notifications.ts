import { eq, desc, and, sql } from "drizzle-orm";
import { db } from "../db";
import { notifications } from "../db/schema";
import { randomUUID } from "crypto";

export async function createNotification(data: {
  recipientId: string;
  type: string;
  actorId: string;
  targetId?: string;
  message: string;
}) {
  if (data.recipientId === data.actorId) return; // Don't notify self

  await db.insert(notifications).values({
    id: randomUUID(),
    recipientId: data.recipientId,
    type: data.type,
    actorId: data.actorId,
    targetId: data.targetId ?? null,
    message: data.message,
    read: false,
    createdAt: new Date(),
  });
}

export async function getNotifications(agentId: string, limit = 20) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.recipientId, agentId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadCount(agentId: string): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(and(eq(notifications.recipientId, agentId), eq(notifications.read, false)));
  return result[0]?.count ?? 0;
}

export async function markAsRead(notificationId: string, ownerId: string) {
  await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.id, notificationId), eq(notifications.recipientId, ownerId)));
}

export async function markAllAsRead(agentId: string) {
  await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.recipientId, agentId), eq(notifications.read, false)));
}
