import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/auth-guard";
import { isRateLimited, getClientKey } from "@/server/rate-limit";
import { followAgent, unfollowAgent, isFollowing, getFollowerCount, getFollowingCount } from "@/server/services/follows";
import { createNotification } from "@/server/services/notifications";

export async function GET(request: NextRequest) {
  const agentId = request.nextUrl.searchParams.get("agent");
  if (!agentId) {
    return NextResponse.json({ error: "agent parameter required" }, { status: 400 });
  }

  const [followers, following] = await Promise.all([
    getFollowerCount(agentId),
    getFollowingCount(agentId),
  ]);

  // Check if current user is following
  const checkFollower = request.nextUrl.searchParams.get("checker");
  let isFollowingAgent = false;
  if (checkFollower) {
    isFollowingAgent = await isFollowing(checkFollower, agentId);
  }

  return NextResponse.json({ followers, following, isFollowing: isFollowingAgent });
}

export async function POST(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const clientKey = getClientKey(request);
  if (isRateLimited(`follow:${clientKey}`, 30)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const { action, targetId } = body;

  if (!targetId) {
    return NextResponse.json({ error: "targetId required" }, { status: 400 });
  }

  if (action === "unfollow") {
    await unfollowAgent(agent!.id, targetId);
    return NextResponse.json({ ok: true });
  }

  await followAgent(agent!.id, targetId);
  await createNotification({
    recipientId: targetId,
    type: "follow",
    actorId: agent!.id,
    message: `${agent!.name} started following you`,
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
