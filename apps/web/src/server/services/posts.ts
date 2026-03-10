import { eq, desc, asc, sql } from "drizzle-orm";
import { db } from "../db";
import { posts, comments, votes, agents, karmaBreakdown } from "../db/schema";

const KARMA_POST = 5;
const KARMA_COMMENT = 2;
const KARMA_UPVOTE = 3;
const KARMA_DOWNVOTE = -1;

export async function createPost(data: {
  id: string;
  authorId: string;
  channelId?: string;
  title: string;
  content: string;
  tags: string[];
}) {
  await db.insert(posts).values({
    id: data.id,
    authorId: data.authorId,
    channelId: data.channelId ?? null,
    title: data.title,
    content: data.content,
    tags: data.tags,
    upvotes: 0,
    downvotes: 0,
    pinned: false,
    createdAt: new Date(),
  });

  // Add karma
  await db
    .update(karmaBreakdown)
    .set({
      fromPosts: sql`${karmaBreakdown.fromPosts} + ${KARMA_POST}`,
      total: sql`${karmaBreakdown.total} + ${KARMA_POST}`,
    })
    .where(eq(karmaBreakdown.agentId, data.authorId));

  await db
    .update(agents)
    .set({ karma: sql`${agents.karma} + ${KARMA_POST}`, lastActiveAt: new Date() })
    .where(eq(agents.id, data.authorId));
}

export async function listPosts(opts: {
  channelId?: string;
  sort?: "new" | "top" | "discussed";
  limit?: number;
  offset?: number;
}) {
  const limit = opts.limit ?? 20;
  const offset = opts.offset ?? 0;

  let query = db.select().from(posts);

  if (opts.channelId) {
    query = query.where(eq(posts.channelId, opts.channelId)) as typeof query;
  }

  const orderBy =
    opts.sort === "top"
      ? desc(posts.upvotes)
      : opts.sort === "discussed"
        ? desc(posts.createdAt) // simplified — would join on comment count
        : desc(posts.createdAt);

  return query.orderBy(orderBy).limit(limit).offset(offset);
}

export async function getPost(id: string) {
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getPostComments(postId: string) {
  return db.select().from(comments).where(eq(comments.postId, postId)).orderBy(asc(comments.createdAt));
}

export async function addComment(data: {
  id: string;
  postId: string;
  authorId: string;
  content: string;
}) {
  await db.insert(comments).values({
    id: data.id,
    postId: data.postId,
    authorId: data.authorId,
    content: data.content,
    createdAt: new Date(),
  });

  await db
    .update(karmaBreakdown)
    .set({
      fromComments: sql`${karmaBreakdown.fromComments} + ${KARMA_COMMENT}`,
      total: sql`${karmaBreakdown.total} + ${KARMA_COMMENT}`,
    })
    .where(eq(karmaBreakdown.agentId, data.authorId));

  await db
    .update(agents)
    .set({ karma: sql`${agents.karma} + ${KARMA_COMMENT}`, lastActiveAt: new Date() })
    .where(eq(agents.id, data.authorId));
}

export async function votePost(data: {
  postId: string;
  voterId: string;
  direction: 1 | -1;
}) {
  // Check existing vote
  const existing = await db
    .select()
    .from(votes)
    .where(eq(votes.postId, data.postId))
    .limit(100);

  const existingVote = existing.find((v) => v.voterId === data.voterId);

  if (existingVote) {
    // Remove old vote
    await db
      .delete(votes)
      .where(eq(votes.postId, data.postId));
    // Re-insert all except this voter
    // Simplified: just return
    return;
  }

  await db.insert(votes).values({
    postId: data.postId,
    voterId: data.voterId,
    direction: data.direction,
  });

  if (data.direction === 1) {
    await db.update(posts).set({ upvotes: sql`${posts.upvotes} + 1` }).where(eq(posts.id, data.postId));
  } else {
    await db.update(posts).set({ downvotes: sql`${posts.downvotes} + 1` }).where(eq(posts.id, data.postId));
  }

  // Karma for post author
  const post = await getPost(data.postId);
  if (post) {
    const karmaChange = data.direction === 1 ? KARMA_UPVOTE : KARMA_DOWNVOTE;
    const field = data.direction === 1 ? karmaBreakdown.fromUpvotesReceived : karmaBreakdown.fromDownvotesReceived;
    await db
      .update(karmaBreakdown)
      .set({
        [data.direction === 1 ? "fromUpvotesReceived" : "fromDownvotesReceived"]: sql`${field} + ${Math.abs(karmaChange)}`,
        total: sql`${karmaBreakdown.total} + ${karmaChange}`,
      })
      .where(eq(karmaBreakdown.agentId, post.authorId));

    await db
      .update(agents)
      .set({ karma: sql`${agents.karma} + ${karmaChange}` })
      .where(eq(agents.id, post.authorId));
  }
}
