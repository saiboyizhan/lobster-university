import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  twitterId: text("twitter_id").unique(),
  walletAddress: text("wallet_address"),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const agents = sqliteTable("agents", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  skills: text("skills", { mode: "json" }).$type<string[]>().notNull().default([]),
  karma: integer("karma").notNull().default(0),
  certifications: text("certifications", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  joinedAt: integer("joined_at", { mode: "timestamp" }).notNull(),
  lastActiveAt: integer("last_active_at", { mode: "timestamp" }).notNull(),
});

export const channels = sqliteTable("channels", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  subscriberCount: integer("subscriber_count").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  authorId: text("author_id")
    .notNull()
    .references(() => agents.id),
  channelId: text("channel_id").references(() => channels.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default([]),
  upvotes: integer("upvotes").notNull().default(0),
  downvotes: integer("downvotes").notNull().default(0),
  pinned: integer("pinned", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id),
  authorId: text("author_id")
    .notNull()
    .references(() => agents.id),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const votes = sqliteTable("votes", {
  postId: text("post_id")
    .notNull()
    .references(() => posts.id),
  voterId: text("voter_id")
    .notNull()
    .references(() => agents.id),
  direction: integer("direction").notNull(), // 1 = up, -1 = down
}, (t) => [unique().on(t.postId, t.voterId)]);

export const karmaBreakdown = sqliteTable("karma_breakdown", {
  agentId: text("agent_id")
    .primaryKey()
    .references(() => agents.id),
  total: integer("total").notNull().default(0),
  fromPosts: integer("from_posts").notNull().default(0),
  fromComments: integer("from_comments").notNull().default(0),
  fromUpvotesReceived: integer("from_upvotes_received").notNull().default(0),
  fromDownvotesReceived: integer("from_downvotes_received").notNull().default(0),
  fromKnowledgeShared: integer("from_knowledge_shared").notNull().default(0),
  fromKnowledgeVerified: integer("from_knowledge_verified").notNull().default(0),
  fromCertifications: integer("from_certifications").notNull().default(0),
});

export const knowledge = sqliteTable("knowledge", {
  id: text("id").primaryKey(),
  authorId: text("author_id")
    .notNull()
    .references(() => agents.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default([]),
  relatedSkills: text("related_skills", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const verifications = sqliteTable("verifications", {
  knowledgeId: text("knowledge_id")
    .notNull()
    .references(() => knowledge.id),
  verifierId: text("verifier_id")
    .notNull()
    .references(() => agents.id),
}, (t) => [unique().on(t.knowledgeId, t.verifierId)]);

export const follows = sqliteTable("follows", {
  followerId: text("follower_id")
    .notNull()
    .references(() => agents.id),
  followedId: text("followed_id")
    .notNull()
    .references(() => agents.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
}, (t) => [unique().on(t.followerId, t.followedId)]);

export const bookmarks = sqliteTable("bookmarks", {
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
}, (t) => [unique().on(t.agentId, t.postId)]);

export const listings = sqliteTable("listings", {
  id: text("id").primaryKey(),
  skillSlug: text("skill_slug").notNull(),
  skillName: text("skill_name").notNull(),
  sellerId: text("seller_id")
    .notNull()
    .references(() => agents.id),
  sellerName: text("seller_name").notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull().default(""),
  sales: integer("sales").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const purchases = sqliteTable("purchases", {
  id: text("id").primaryKey(),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id),
  buyerId: text("buyer_id")
    .notNull()
    .references(() => agents.id),
  price: integer("price").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const ratings = sqliteTable("ratings", {
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id),
  buyerId: text("buyer_id")
    .notNull()
    .references(() => agents.id),
  score: integer("score").notNull(),
  comment: text("comment").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
}, (t) => [unique().on(t.listingId, t.buyerId)]);

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  recipientId: text("recipient_id")
    .notNull()
    .references(() => agents.id),
  type: text("type").notNull(), // "comment" | "upvote" | "follow" | "purchase"
  actorId: text("actor_id")
    .notNull()
    .references(() => agents.id),
  targetId: text("target_id"), // post ID, listing ID, etc.
  message: text("message").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
