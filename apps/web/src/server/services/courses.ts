import { eq, sql, like, desc } from "drizzle-orm";
import { db } from "../db";
import { courses, departments, colleges } from "../db/schema";

export async function listCourses(opts?: {
  collegeSlug?: string;
  departmentSlug?: string;
  query?: string;
}) {
  let query = db
    .select({
      id: courses.id,
      code: courses.code,
      title: courses.title,
      description: courses.description,
      credits: courses.credits,
      skillSlugs: courses.skillSlugs,
      prerequisiteCourseIds: courses.prerequisiteCourseIds,
      departmentId: courses.departmentId,
      departmentName: departments.name,
      departmentSlug: departments.slug,
      collegeId: colleges.id,
      collegeName: colleges.name,
      collegeSlug: colleges.slug,
    })
    .from(courses)
    .innerJoin(departments, eq(departments.id, courses.departmentId))
    .innerJoin(colleges, eq(colleges.id, departments.collegeId))
    .$dynamic();

  if (opts?.collegeSlug) {
    query = query.where(eq(colleges.slug, opts.collegeSlug));
  }
  if (opts?.departmentSlug) {
    query = query.where(eq(departments.slug, opts.departmentSlug));
  }
  if (opts?.query) {
    const escaped = opts.query.replace(/[%_\\]/g, "\\$&");
    const pattern = `%${escaped}%`;
    query = query.where(
      sql`(${courses.code} LIKE ${pattern} OR ${courses.title} LIKE ${pattern})`
    );
  }

  return query.orderBy(courses.code);
}

export async function getCourse(code: string) {
  const rows = await db
    .select({
      id: courses.id,
      code: courses.code,
      title: courses.title,
      description: courses.description,
      credits: courses.credits,
      maxEnrollment: courses.maxEnrollment,
      skillSlugs: courses.skillSlugs,
      prerequisiteCourseIds: courses.prerequisiteCourseIds,
      departmentId: courses.departmentId,
      departmentName: departments.name,
      departmentSlug: departments.slug,
      collegeId: colleges.id,
      collegeName: colleges.name,
      collegeSlug: colleges.slug,
      createdAt: courses.createdAt,
    })
    .from(courses)
    .innerJoin(departments, eq(departments.id, courses.departmentId))
    .innerJoin(colleges, eq(colleges.id, departments.collegeId))
    .where(eq(courses.code, code))
    .limit(1);

  return rows[0] ?? null;
}

export async function getCoursesByDepartment(departmentId: string) {
  return db
    .select()
    .from(courses)
    .where(eq(courses.departmentId, departmentId))
    .orderBy(courses.code);
}

export async function getCourseBySkillSlug(skillSlug: string) {
  const allCourses = await db.select().from(courses);
  return allCourses.find((c) =>
    (c.skillSlugs as string[]).includes(skillSlug)
  ) ?? null;
}
