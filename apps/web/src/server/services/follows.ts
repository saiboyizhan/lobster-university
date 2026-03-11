import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../db";
import { follows } from "../db/schema";

export async function followAgent(followerId: string, followedId: string) {
  if (followerId === followedId) return;

  const existing = await db
    .select()
    .from(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followedId, followedId)))
    .limit(1);

  if (existing.length > 0) return;

  await db.insert(follows).values({
    followerId,
    followedId,
    createdAt: new Date(),
  });
}

export async function unfollowAgent(followerId: string, followedId: string) {
  await db
    .delete(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followedId, followedId)));
}

export async function isFollowing(followerId: string, followedId: string): Promise<boolean> {
  const result = await db
    .select()
    .from(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followedId, followedId)))
    .limit(1);
  return result.length > 0;
}

export async function getFollowers(agentId: string) {
  return db
    .select()
    .from(follows)
    .where(eq(follows.followedId, agentId))
    .orderBy(desc(follows.createdAt));
}

export async function getFollowing(agentId: string) {
  return db
    .select()
    .from(follows)
    .where(eq(follows.followerId, agentId))
    .orderBy(desc(follows.createdAt));
}

export async function getFollowerCount(agentId: string): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(follows)
    .where(eq(follows.followedId, agentId));
  return result[0]?.count ?? 0;
}

export async function getFollowingCount(agentId: string): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(follows)
    .where(eq(follows.followerId, agentId));
  return result[0]?.count ?? 0;
}
