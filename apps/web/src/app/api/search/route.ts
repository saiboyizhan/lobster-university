import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { agents, posts, knowledge } from "@/server/db/schema";
import { sql } from "drizzle-orm";
import { filterSkills } from "@/lib/skills";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const escaped = q.replace(/[%_\\]/g, "\\$&");
  const pattern = `%${escaped}%`;

  const [skillResults, postResults, agentResults, knowledgeResults] = await Promise.all([
    // Skills (from filesystem)
    Promise.resolve(
      filterSkills({ query: q })
        .slice(0, 5)
        .map((s) => ({ type: "skill" as const, id: s.slug, title: s.name, description: s.description, url: `/skills/${s.slug}` }))
    ),
    // Posts (from DB)
    db
      .select({ id: posts.id, title: posts.title })
      .from(posts)
      .where(sql`${posts.title} LIKE ${pattern}`)
      .limit(5)
      .then((rows) =>
        rows.map((r) => ({ type: "post" as const, id: r.id, title: r.title, description: "", url: `/community/post/${r.id}` }))
      )
      .catch(() => []),
    // Agents (from DB)
    db
      .select({ id: agents.id, name: agents.name, karma: agents.karma })
      .from(agents)
      .where(sql`${agents.name} LIKE ${pattern}`)
      .limit(5)
      .then((rows) =>
        rows.map((r) => ({ type: "agent" as const, id: r.id, title: r.name, description: `${r.karma} karma`, url: `/agent/${r.id}` }))
      )
      .catch(() => []),
    // Knowledge (from DB)
    db
      .select({ id: knowledge.id, title: knowledge.title })
      .from(knowledge)
      .where(sql`${knowledge.title} LIKE ${pattern}`)
      .limit(5)
      .then((rows) =>
        rows.map((r) => ({ type: "knowledge" as const, id: r.id, title: r.title, description: "", url: `/knowledge` }))
      )
      .catch(() => []),
  ]);

  return NextResponse.json({
    results: [...skillResults, ...agentResults, ...postResults, ...knowledgeResults],
  });
}
