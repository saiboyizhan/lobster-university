import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/auth-guard";
import { isAdmin } from "@/server/auth-guard";
import { recordGrade } from "@/server/services/grading";
import { updateCreditsAndGpa } from "@/server/services/student-profiles";
import { db } from "@/server/db";
import { enrollments } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { enrollmentId, grade } = body;

  if (!enrollmentId || !grade) {
    return NextResponse.json({ error: "enrollmentId and grade required" }, { status: 400 });
  }

  const validGrades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F", "P"];
  if (!validGrades.includes(grade)) {
    return NextResponse.json({ error: "Invalid grade" }, { status: 400 });
  }

  const result = await recordGrade(enrollmentId, grade);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Get agent ID and update their GPA
  const enrollment = await db
    .select({ agentId: enrollments.agentId })
    .from(enrollments)
    .where(eq(enrollments.id, enrollmentId))
    .limit(1);

  if (enrollment[0]) {
    await updateCreditsAndGpa(enrollment[0].agentId);
  }

  return NextResponse.json({ ok: true });
}
