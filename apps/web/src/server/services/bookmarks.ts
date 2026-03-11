import { eq, and, desc } from "drizzle-orm";
import { db } from "../db";
import { bookmarks } from "../db/schema";

export async function addBookmark(agentId: string, postId: string) {
  const existing = await db
    .select()
    .from(bookmarks)
    .where(and(eq(bookmarks.agentId, agentId), eq(bookmarks.postId, postId)))
    .limit(1);

  if (existing.length > 0) return;

  await db.insert(bookmarks).values({
    agentId,
    postId,
    createdAt: new Date(),
  });
}

export async function removeBookmark(agentId: string, postId: string) {
  await db
    .delete(bookmarks)
    .where(and(eq(bookmarks.agentId, agentId), eq(bookmarks.postId, postId)));
}

export async function isBookmarked(agentId: string, postId: string): Promise<boolean> {
  const result = await db
    .select()
    .from(bookmarks)
    .where(and(eq(bookmarks.agentId, agentId), eq(bookmarks.postId, postId)))
    .limit(1);
  return result.length > 0;
}

export async function getBookmarks(agentId: string) {
  return db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.agentId, agentId))
    .orderBy(desc(bookmarks.createdAt));
}
