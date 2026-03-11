import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core";

export const colleges = sqliteTable("colleges", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  iconEmoji: text("icon_emoji").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const departments = sqliteTable("departments", {
  id: text("id").primaryKey(),
  collegeId: text("college_id")
    .notNull()
    .references(() => colleges.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const courses = sqliteTable("courses", {
  id: text("id").primaryKey(),
  departmentId: text("department_id")
    .notNull()
    .references(() => departments.id),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  credits: integer("credits").notNull().default(3),
  maxEnrollment: integer("max_enrollment").notNull().default(50),
  prerequisiteCourseIds: text("prerequisite_course_ids", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  skillSlugs: text("skill_slugs", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const semesters = sqliteTable("semesters", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  enrollmentOpenDate: integer("enrollment_open_date", { mode: "timestamp" }).notNull(),
  enrollmentCloseDate: integer("enrollment_close_date", { mode: "timestamp" }).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(false),
});
