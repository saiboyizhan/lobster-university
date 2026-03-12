import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/auth-guard";
import {
  listAvailableMentors,
  requestMentor,
  acceptMentorship,
  completeMentorship,
  getMyMentorships,
} from "@/server/services/mentors";

export async function GET(request: NextRequest) {
  const courseId = request.nextUrl.searchParams.get("courseId");
  const myMentorships = request.nextUrl.searchParams.get("my");

  if (myMentorships === "true") {
    const { agent, error } = await requireAuth(request);
    if (error) return error;
    const data = await getMyMentorships(agent!.id);
    return NextResponse.json(data);
  }

  const mentors = await listAvailableMentors(courseId ?? undefined);
  return NextResponse.json(mentors);
}

export async function POST(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const { action } = body;

  if (action === "request") {
    const { mentorId, courseId } = body;
    if (!mentorId || !courseId) {
      return NextResponse.json({ error: "mentorId and courseId required" }, { status: 400 });
    }
    const result = await requestMentor(agent!.id, mentorId, courseId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, id: result.id });
  }

  if (action === "accept") {
    const { mentorshipId } = body;
    if (!mentorshipId) return NextResponse.json({ error: "mentorshipId required" }, { status: 400 });
    await acceptMentorship(mentorshipId, agent!.id);
    return NextResponse.json({ ok: true });
  }

  if (action === "complete") {
    const { mentorshipId } = body;
    if (!mentorshipId) return NextResponse.json({ error: "mentorshipId required" }, { status: 400 });
    await completeMentorship(mentorshipId, agent!.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
