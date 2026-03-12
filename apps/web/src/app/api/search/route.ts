import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { agents, posts, knowledge, courses, faculty, studyGroups } from "@/server/db/schema";
import { sql } from "drizzle-orm";
import { filterSkills } from "@/lib/skills";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const escaped = q.replace(/[%_\\]/g, "\\$&");
  const pattern = `%${escaped}%`;

  const [skillResults, courseResults, agentResults, facultyResults, postResults, groupResults, knowledgeResults] = await Promise.all([
    // Skills (from filesystem)
    Promise.resolve(
      filterSkills({ query: q })
        .slice(0, 5)
        .map((s) => ({ type: "skill" as const, id: s.slug, title: s.name, description: s.description, url: `/skills/${s.slug}` }))
    ),
    // Courses (from DB)
    db
      .select({ id: courses.id, code: courses.code, title: courses.title })
      .from(courses)
      .where(sql`${courses.title} LIKE ${pattern} OR ${courses.code} LIKE ${pattern}`)
      .limit(5)
      .then((rows) =>
        rows.map((r) => ({ type: "course" as const, id: r.id, title: `${r.code} ${r.title}`, description: "", url: `/courses/${r.code}` }))
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
    // Faculty (from DB)
    db
      .select({ id: faculty.id, name: faculty.name, title: faculty.title })
      .from(faculty)
      .where(sql`${faculty.name} LIKE ${pattern}`)
      .limit(5)
      .then((rows) =>
        rows.map((r) => ({ type: "faculty" as const, id: r.id, title: r.name, description: r.title, url: `/faculty/${r.id}` }))
      )
      .catch(() => []),
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
    // Study Groups (from DB)
    db
      .select({ id: studyGroups.id, name: studyGroups.name })
      .from(studyGroups)
      .where(sql`${studyGroups.name} LIKE ${pattern}`)
      .limit(5)
      .then((rows) =>
        rows.map((r) => ({ type: "group" as const, id: r.id, title: r.name, description: "Study Group", url: `/study-groups/${r.id}` }))
      )
      .catch(() => []),
    // Knowledge (from DB)
    db
      .select({ id: knowledge.id, title: knowledge.title })
      .from(knowledge)
      .where(sql`${knowledge.title} LIKE ${pattern}`)
      .limit(3)
      .then((rows) =>
        rows.map((r) => ({ type: "knowledge" as const, id: r.id, title: r.title, description: "", url: `/knowledge` }))
      )
      .catch(() => []),
  ]);

  return NextResponse.json({
    results: [...courseResults, ...skillResults, ...agentResults, ...facultyResults, ...groupResults, ...postResults, ...knowledgeResults],
  });
}
