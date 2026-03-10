import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  twitterId: text("twitter_id").unique(),
  walletAddress: text("wallet_address"),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
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
});

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
});
