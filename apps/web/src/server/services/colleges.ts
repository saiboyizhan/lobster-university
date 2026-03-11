import { eq, sql, desc } from "drizzle-orm";
import { db } from "../db";
import { colleges, departments, courses } from "../db/schema";

export async function listColleges() {
  const rows = await db
    .select({
      id: colleges.id,
      name: colleges.name,
      slug: colleges.slug,
      description: colleges.description,
      iconEmoji: colleges.iconEmoji,
      createdAt: colleges.createdAt,
      departmentCount: sql<number>`count(distinct ${departments.id})`,
      courseCount: sql<number>`count(distinct ${courses.id})`,
    })
    .from(colleges)
    .leftJoin(departments, eq(departments.collegeId, colleges.id))
    .leftJoin(courses, eq(courses.departmentId, departments.id))
    .groupBy(colleges.id)
    .orderBy(colleges.name);

  return rows;
}

export async function getCollege(slug: string) {
  const rows = await db
    .select()
    .from(colleges)
    .where(eq(colleges.slug, slug))
    .limit(1);

  return rows[0] ?? null;
}

export async function getCollegeDepartments(collegeId: string) {
  const rows = await db
    .select({
      id: departments.id,
      name: departments.name,
      slug: departments.slug,
      description: departments.description,
      collegeId: departments.collegeId,
      createdAt: departments.createdAt,
      courseCount: sql<number>`count(${courses.id})`,
    })
    .from(departments)
    .leftJoin(courses, eq(courses.departmentId, departments.id))
    .where(eq(departments.collegeId, collegeId))
    .groupBy(departments.id)
    .orderBy(departments.name);

  return rows;
}

export async function getDepartment(slug: string) {
  const rows = await db
    .select()
    .from(departments)
    .where(eq(departments.slug, slug))
    .limit(1);

  return rows[0] ?? null;
}
