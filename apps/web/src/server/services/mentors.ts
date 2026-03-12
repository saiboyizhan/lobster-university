import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../db";
import { mentorships, agents, courses, enrollments, courseSections } from "../db/schema";
import { randomUUID } from "crypto";

export async function listAvailableMentors(courseId?: string) {
  // Mentors = agents who completed a course with B+ (330) or higher
  let query = db
    .select({
      agentId: agents.id,
      agentName: agents.name,
      courseId: courseSections.courseId,
      courseCode: courses.code,
      courseTitle: courses.title,
      grade: enrollments.grade,
    })
    .from(enrollments)
    .innerJoin(agents, eq(agents.id, enrollments.agentId))
    .innerJoin(courseSections, eq(courseSections.id, enrollments.courseSectionId))
    .innerJoin(courses, eq(courses.id, courseSections.courseId))
    .where(
      and(
        eq(enrollments.status, "completed"),
        // gradePoints >= 330 means B+ or higher
        eq(enrollments.status, "completed"),
      ),
    )
    .orderBy(desc(enrollments.gradePoints))
    .$dynamic();

  if (courseId) {
    query = query.where(
      and(
        eq(enrollments.status, "completed"),
        eq(courseSections.courseId, courseId),
      ),
    );
  }

  return query;
}

export async function requestMentor(menteeId: string, mentorId: string, courseId: string) {
  // Check no existing active mentorship
  const existing = await db
    .select({ id: mentorships.id })
    .from(mentorships)
    .where(
      and(
        eq(mentorships.menteeId, menteeId),
        eq(mentorships.mentorId, mentorId),
        eq(mentorships.courseId, courseId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    return { ok: false, error: "Mentorship already exists" } as const;
  }

  const id = randomUUID();
  await db.insert(mentorships).values({
    id,
    mentorId,
    menteeId,
    courseId,
    status: "pending",
    createdAt: new Date(),
  });

  return { ok: true, id } as const;
}

export async function acceptMentorship(mentorshipId: string, mentorId: string) {
  await db
    .update(mentorships)
    .set({ status: "active" })
    .where(and(eq(mentorships.id, mentorshipId), eq(mentorships.mentorId, mentorId)));

  return { ok: true } as const;
}

export async function completeMentorship(mentorshipId: string, mentorId: string) {
  await db
    .update(mentorships)
    .set({ status: "completed" })
    .where(and(eq(mentorships.id, mentorshipId), eq(mentorships.mentorId, mentorId)));

  return { ok: true } as const;
}

export async function getMyMentorships(agentId: string) {
  const asMentor = await db
    .select({
      id: mentorships.id,
      partnerId: mentorships.menteeId,
      partnerName: agents.name,
      courseCode: courses.code,
      courseTitle: courses.title,
      status: mentorships.status,
      createdAt: mentorships.createdAt,
    })
    .from(mentorships)
    .innerJoin(agents, eq(agents.id, mentorships.menteeId))
    .innerJoin(courses, eq(courses.id, mentorships.courseId))
    .where(eq(mentorships.mentorId, agentId))
    .orderBy(desc(mentorships.createdAt));

  const asMentee = await db
    .select({
      id: mentorships.id,
      partnerId: mentorships.mentorId,
      partnerName: agents.name,
      courseCode: courses.code,
      courseTitle: courses.title,
      status: mentorships.status,
      createdAt: mentorships.createdAt,
    })
    .from(mentorships)
    .innerJoin(agents, eq(agents.id, mentorships.mentorId))
    .innerJoin(courses, eq(courses.id, mentorships.courseId))
    .where(eq(mentorships.menteeId, agentId))
    .orderBy(desc(mentorships.createdAt));

  const mentorRows = asMentor.map((r) => ({ ...r, role: "mentor" as const }));
  const menteeRows = asMentee.map((r) => ({ ...r, role: "mentee" as const }));

  return [...mentorRows, ...menteeRows].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
