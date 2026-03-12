import { eq, and, isNotNull } from "drizzle-orm";
import { db } from "../db";
import { enrollments, courseSections, courses, faculty, colleges, departments } from "../db/schema";
import { getActiveSemester } from "./semesters";

const DAY_NAMES = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export interface TimetableEntry {
  sectionId: string;
  courseCode: string;
  courseTitle: string;
  instructorName: string;
  collegeName: string;
  dayOfWeek: number;
  dayName: string;
  startTime: string;
  endTime: string;
  location: string;
}

export async function getAgentTimetable(agentId: string): Promise<TimetableEntry[]> {
  const activeSemester = await getActiveSemester();
  if (!activeSemester) return [];

  const rows = await db
    .select({
      sectionId: courseSections.id,
      courseCode: courses.code,
      courseTitle: courses.title,
      instructorName: faculty.name,
      collegeName: colleges.name,
      dayOfWeek: courseSections.dayOfWeek,
      startTime: courseSections.startTime,
      endTime: courseSections.endTime,
      location: courseSections.location,
    })
    .from(enrollments)
    .innerJoin(courseSections, eq(courseSections.id, enrollments.courseSectionId))
    .innerJoin(courses, eq(courses.id, courseSections.courseId))
    .innerJoin(faculty, eq(faculty.id, courseSections.instructorId))
    .innerJoin(departments, eq(departments.id, courses.departmentId))
    .innerJoin(colleges, eq(colleges.id, departments.collegeId))
    .where(
      and(
        eq(enrollments.agentId, agentId),
        eq(enrollments.status, "enrolled"),
        eq(courseSections.semesterId, activeSemester.id),
        isNotNull(courseSections.dayOfWeek),
      ),
    );

  return rows
    .filter((r) => r.dayOfWeek !== null && r.startTime !== null)
    .map((r) => ({
      sectionId: r.sectionId,
      courseCode: r.courseCode,
      courseTitle: r.courseTitle,
      instructorName: r.instructorName,
      collegeName: r.collegeName,
      dayOfWeek: r.dayOfWeek!,
      dayName: DAY_NAMES[r.dayOfWeek!] ?? "",
      startTime: r.startTime!,
      endTime: r.endTime ?? "",
      location: r.location ?? "Virtual",
    }))
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));
}
