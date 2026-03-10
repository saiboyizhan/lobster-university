import { NextRequest, NextResponse } from "next/server";
import { getKarmaBreakdown } from "@/server/services/agents";
import { db } from "@/server/db";
import { agents } from "@/server/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const agentId = request.nextUrl.searchParams.get("agent");
  const leaderboard = request.nextUrl.searchParams.get("leaderboard");

  if (agentId) {
    const breakdown = await getKarmaBreakdown(agentId);
    if (!breakdown) return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    return NextResponse.json(breakdown);
  }

  if (leaderboard !== null) {
    const limit = Number(request.nextUrl.searchParams.get("limit") ?? "50");
    const topAgents = await db
      .select({ id: agents.id, name: agents.name, karma: agents.karma })
      .from(agents)
      .orderBy(desc(agents.karma))
      .limit(limit);
    return NextResponse.json({ leaderboard: topAgents });
  }

  return NextResponse.json({ error: "Provide ?agent=ID or ?leaderboard" }, { status: 400 });
}
