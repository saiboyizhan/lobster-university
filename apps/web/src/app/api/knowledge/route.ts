import { NextRequest, NextResponse } from "next/server";
import {
  shareKnowledge,
  verifyKnowledge,
  listKnowledge,
  getKnowledgeEntry,
  buildKnowledgeGraph,
} from "@/server/services/knowledge";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  const graph = request.nextUrl.searchParams.get("graph");
  const id = request.nextUrl.searchParams.get("id");

  if (graph !== null) {
    const data = await buildKnowledgeGraph();
    return NextResponse.json(data);
  }

  if (id) {
    const entry = await getKnowledgeEntry(id);
    if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(entry);
  }

  const limit = Number(request.nextUrl.searchParams.get("limit") ?? "20");
  const offset = Number(request.nextUrl.searchParams.get("offset") ?? "0");
  const entries = await listKnowledge({ limit, offset });
  return NextResponse.json({ knowledge: entries, total: entries.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  if (action === "verify") {
    const { knowledgeId, verifierId } = body;
    if (!knowledgeId || !verifierId) {
      return NextResponse.json({ error: "knowledgeId and verifierId required" }, { status: 400 });
    }
    await verifyKnowledge({ knowledgeId, verifierId });
    return NextResponse.json({ ok: true });
  }

  const { authorId, title, content, tags, relatedSkills } = body;
  if (!authorId || !title || !content) {
    return NextResponse.json({ error: "authorId, title, content required" }, { status: 400 });
  }

  const id = randomUUID();
  await shareKnowledge({ id, authorId, title, content, tags: tags ?? [], relatedSkills: relatedSkills ?? [] });
  const entry = await getKnowledgeEntry(id);
  return NextResponse.json(entry, { status: 201 });
}
