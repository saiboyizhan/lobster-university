import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core";
import { agents } from "./core";
import { courses, semesters, departments } from "./university";

export const faculty = sqliteTable("faculty", {
  id: text("id").primaryKey(),
  agentId: text("agent_id").references(() => agents.id),
  name: text("name").notNull(),
  title: text("title").notNull().default("Professor"),
  departmentId: text("department_id")
    .notNull()
    .references(() => departments.id),
  bio: text("bio").notNull().default(""),
  avatarUrl: text("avatar_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const courseSections = sqliteTable("course_sections", {
  id: text("id").primaryKey(),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id),
  semesterId: text("semester_id")
    .notNull()
    .references(() => semesters.id),
  instructorId: text("instructor_id")
    .notNull()
    .references(() => faculty.id),
  sectionNumber: integer("section_number").notNull().default(1),
  maxEnrollment: integer("max_enrollment").notNull().default(50),
  currentEnrollment: integer("current_enrollment").notNull().default(0),
  dayOfWeek: integer("day_of_week"), // 1=Mon ... 5=Fri (null = TBD)
  startTime: text("start_time"), // "09:00"
  endTime: text("end_time"), // "10:30"
  location: text("location").default("Virtual"),
});

export const enrollments = sqliteTable("enrollments", {
  id: text("id").primaryKey(),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id),
  courseSectionId: text("course_section_id")
    .notNull()
    .references(() => courseSections.id),
  status: text("status").notNull().default("enrolled"),
  grade: text("grade"),
  gradePoints: integer("grade_points"),
  enrolledAt: integer("enrolled_at", { mode: "timestamp" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
}, (t) => [unique().on(t.agentId, t.courseSectionId)]);

export const studentProfiles = sqliteTable("student_profiles", {
  agentId: text("agent_id")
    .primaryKey()
    .references(() => agents.id),
  collegeId: text("college_id").notNull(),
  degreeProgramId: text("degree_program_id"),
  totalCreditsEarned: integer("total_credits_earned").notNull().default(0),
  cumulativeGpa: integer("cumulative_gpa").notNull().default(0),
  enrollmentStatus: text("enrollment_status").notNull().default("active"),
  enrolledAt: integer("enrolled_at", { mode: "timestamp" }).notNull(),
});
