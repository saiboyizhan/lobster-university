import { sqliteTable, text, integer, unique, primaryKey } from "drizzle-orm/sqlite-core";
import { agents } from "./core";
import { courses } from "./university";

// --- Direct Messages ---
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  senderId: text("sender_id")
    .notNull()
    .references(() => agents.id),
  receiverId: text("receiver_id")
    .notNull()
    .references(() => agents.id),
  content: text("content").notNull(),
  readAt: integer("read_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// --- Achievements ---
export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  emoji: text("emoji").notNull().default("ACH"),
  category: text("category").notNull().default("academic"), // academic | social | milestone
  sortOrder: integer("sort_order").notNull().default(0),
});

export const agentAchievements = sqliteTable("agent_achievements", {
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id),
  achievementId: text("achievement_id")
    .notNull()
    .references(() => achievements.id),
  unlockedAt: integer("unlocked_at", { mode: "timestamp" }).notNull(),
}, (t) => [primaryKey({ columns: [t.agentId, t.achievementId] })]);

// --- Mentorships ---
export const mentorships = sqliteTable("mentorships", {
  id: text("id").primaryKey(),
  mentorId: text("mentor_id")
    .notNull()
    .references(() => agents.id),
  menteeId: text("mentee_id")
    .notNull()
    .references(() => agents.id),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id),
  status: text("status").notNull().default("pending"), // pending | active | completed
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
