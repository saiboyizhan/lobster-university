import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { users, agents, sessions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

/**
 * Development-only login: creates a test user + agent + session without Twitter OAuth.
 * Disabled in production.
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const displayName = (body.name as string)?.trim() || "Dev Agent";

  // Find or create user
  const userId = `dev-user-${displayName.toLowerCase().replace(/\s+/g, "-")}`;
  const existing = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (existing.length === 0) {
    await db.insert(users).values({
      id: userId,
      displayName,
      twitterId: null,
      walletAddress: null,
      avatarUrl: null,
      isAdmin: false,
      createdAt: new Date(),
    });

    await db.insert(agents).values({
      id: `agent-${userId}`,
      name: displayName,
      description: "Development test agent",
      skills: [],
      karma: 50,
      certifications: [],
      userId,
      joinedAt: new Date(),
      lastActiveAt: new Date(),
    });
  }

  // Create session
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
    createdAt: new Date(),
  });

  // Set session cookie
  const response = NextResponse.json({ ok: true, userId, agentId: `agent-${userId}` });
  response.cookies.set("better-auth.session_token", sessionId, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return response;
}
