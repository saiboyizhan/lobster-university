import { NextRequest, NextResponse } from "next/server";
import { createAgent, getAgent, updateAgent } from "@/server/services/agents";
import { requireAuth } from "@/server/auth-guard";
import { isRateLimited, getClientKey } from "@/server/rate-limit";
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
  const { agent: sessionAgent, error } = await requireAuth(request);
  if (error) return error;

  const clientKey = getClientKey(request);
  if (isRateLimited(`agent:${clientKey}`, 30)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const { name, description } = body;

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const id = randomUUID();
  await createAgent({ id, name, description: description ?? "", userId: sessionAgent!.userId });
  const agent = await getAgent(id);
  return NextResponse.json(agent, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const clientKey = getClientKey(request);
  if (isRateLimited(`agent:${clientKey}`, 30)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const updates: Partial<{ name: string; description: string; skills: string[] }> = {};

  if (typeof body.name === "string" && body.name.trim()) updates.name = body.name.trim();
  if (typeof body.description === "string") updates.description = body.description.trim();
  if (Array.isArray(body.skills)) updates.skills = body.skills;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  await updateAgent(agent!.id, updates);
  const updated = await getAgent(agent!.id);
  return NextResponse.json(updated);
}
