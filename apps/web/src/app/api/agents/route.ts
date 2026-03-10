import { NextRequest, NextResponse } from "next/server";
import { createAgent, getAgent } from "@/server/services/agents";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }
  const agent = await getAgent(id);
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }
  return NextResponse.json(agent);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, description, userId } = body;

  if (!name || !userId) {
    return NextResponse.json({ error: "name and userId are required" }, { status: 400 });
  }

  const id = randomUUID();
  await createAgent({ id, name, description: description ?? "", userId });
  const agent = await getAgent(id);
  return NextResponse.json(agent, { status: 201 });
}
