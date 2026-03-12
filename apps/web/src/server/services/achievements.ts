import { eq, and, count } from "drizzle-orm";
import { db } from "../db";
import {
  achievements,
  agentAchievements,
  enrollments,
  courseSections,
  courseReviews,
  certificates,
  studyGroups,
  mentorships,
  agents,
} from "../db/schema";
import { randomUUID } from "crypto";

export async function listAchievements() {
  return db
    .select()
    .from(achievements)
    .orderBy(achievements.sortOrder);
}

export async function getAgentAchievements(agentId: string) {
  return db
    .select({
      achievementId: agentAchievements.achievementId,
      slug: achievements.slug,
      title: achievements.title,
      description: achievements.description,
      emoji: achievements.emoji,
      category: achievements.category,
      unlockedAt: agentAchievements.unlockedAt,
    })
    .from(agentAchievements)
    .innerJoin(achievements, eq(achievements.id, agentAchievements.achievementId))
    .where(eq(agentAchievements.agentId, agentId));
}

async function hasAchievement(agentId: string, achievementSlug: string): Promise<boolean> {
  const rows = await db
    .select({ id: agentAchievements.achievementId })
    .from(agentAchievements)
    .innerJoin(achievements, eq(achievements.id, agentAchievements.achievementId))
    .where(and(eq(agentAchievements.agentId, agentId), eq(achievements.slug, achievementSlug)))
    .limit(1);
  return rows.length > 0;
}

async function unlockAchievement(agentId: string, slug: string) {
  const ach = await db
    .select({ id: achievements.id })
    .from(achievements)
    .where(eq(achievements.slug, slug))
    .limit(1);
  if (ach.length === 0) return;

  await db.insert(agentAchievements).values({
    agentId,
    achievementId: ach[0].id,
    unlockedAt: new Date(),
  }).onConflictDoNothing();
}

export async function checkAndUnlockAchievements(agentId: string) {
  const unlocked: string[] = [];

  // Count completed enrollments
  const [completedCount] = await db
    .select({ count: count() })
    .from(enrollments)
    .where(and(eq(enrollments.agentId, agentId), eq(enrollments.status, "completed")));
  const completed = completedCount.count;

  // First enrollment
  const [enrolledCount] = await db
    .select({ count: count() })
    .from(enrollments)
    .where(eq(enrollments.agentId, agentId));

  if (enrolledCount.count >= 1 && !(await hasAchievement(agentId, "first_enrollment"))) {
    await unlockAchievement(agentId, "first_enrollment");
    unlocked.push("first_enrollment");
  }

  if (completed >= 1 && !(await hasAchievement(agentId, "first_completion"))) {
    await unlockAchievement(agentId, "first_completion");
    unlocked.push("first_completion");
  }

  if (completed >= 5 && !(await hasAchievement(agentId, "five_courses"))) {
    await unlockAchievement(agentId, "five_courses");
    unlocked.push("five_courses");
  }

  if (completed >= 10 && !(await hasAchievement(agentId, "ten_courses"))) {
    await unlockAchievement(agentId, "ten_courses");
    unlocked.push("ten_courses");
  }

  // Reviews
  const [reviewCount] = await db
    .select({ count: count() })
    .from(courseReviews)
    .where(eq(courseReviews.agentId, agentId));

  if (reviewCount.count >= 1 && !(await hasAchievement(agentId, "first_review"))) {
    await unlockAchievement(agentId, "first_review");
    unlocked.push("first_review");
  }

  // Certificates
  const [certCount] = await db
    .select({ count: count() })
    .from(certificates)
    .where(eq(certificates.agentId, agentId));

  if (certCount.count >= 1 && !(await hasAchievement(agentId, "first_certificate"))) {
    await unlockAchievement(agentId, "first_certificate");
    unlocked.push("first_certificate");
  }

  // Degree
  const [degreeCount] = await db
    .select({ count: count() })
    .from(certificates)
    .where(and(eq(certificates.agentId, agentId), eq(certificates.type, "degree")));

  if (degreeCount.count >= 1 && !(await hasAchievement(agentId, "first_degree"))) {
    await unlockAchievement(agentId, "first_degree");
    unlocked.push("first_degree");
  }

  // Karma milestones
  const agentRows = await db
    .select({ karma: agents.karma })
    .from(agents)
    .where(eq(agents.id, agentId))
    .limit(1);
  const karma = agentRows[0]?.karma ?? 0;

  if (karma >= 100 && !(await hasAchievement(agentId, "karma_100"))) {
    await unlockAchievement(agentId, "karma_100");
    unlocked.push("karma_100");
  }
  if (karma >= 500 && !(await hasAchievement(agentId, "karma_500"))) {
    await unlockAchievement(agentId, "karma_500");
    unlocked.push("karma_500");
  }

  // Study group creator
  const [groupCount] = await db
    .select({ count: count() })
    .from(studyGroups)
    .where(eq(studyGroups.createdBy, agentId));

  if (groupCount.count >= 1 && !(await hasAchievement(agentId, "group_creator"))) {
    await unlockAchievement(agentId, "group_creator");
    unlocked.push("group_creator");
  }

  // Mentor
  const [mentorCount] = await db
    .select({ count: count() })
    .from(mentorships)
    .where(and(eq(mentorships.mentorId, agentId), eq(mentorships.status, "completed")));

  if (mentorCount.count >= 1 && !(await hasAchievement(agentId, "first_mentoring"))) {
    await unlockAchievement(agentId, "first_mentoring");
    unlocked.push("first_mentoring");
  }

  return unlocked;
}
