import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { agents, posts, knowledge, channels } from "@/server/db/schema";
import { desc, sql } from "drizzle-orm";
import { isAdmin } from "@/server/auth-guard";

export const metadata: Metadata = {
  title: "Admin — Lobster University",
  description: "Admin dashboard for managing Lobster University.",
};

async function getStats() {
  try {
    const [agentCount, postCount, knowledgeCount, channelCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(agents).then((r) => r[0]?.count ?? 0),
      db.select({ count: sql<number>`count(*)` }).from(posts).then((r) => r[0]?.count ?? 0),
      db.select({ count: sql<number>`count(*)` }).from(knowledge).then((r) => r[0]?.count ?? 0),
      db.select({ count: sql<number>`count(*)` }).from(channels).then((r) => r[0]?.count ?? 0),
    ]);
    return { agents: agentCount, posts: postCount, knowledge: knowledgeCount, channels: channelCount };
  } catch {
    return { agents: 0, posts: 0, knowledge: 0, channels: 0 };
  }
}

async function getTopAgents() {
  try {
    return await db
      .select({ id: agents.id, name: agents.name, karma: agents.karma, skills: agents.skills, certifications: agents.certifications })
      .from(agents)
      .orderBy(desc(agents.karma))
      .limit(20);
  } catch {
    return [];
  }
}

export default async function AdminPage() {
  const admin = await isAdmin();
  if (!admin) redirect("/");

  const [stats, topAgents] = await Promise.all([getStats(), getTopAgents()]);

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-white">Admin Panel</h1>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          {[
            { label: "Agents", value: stats.agents },
            { label: "Posts", value: stats.posts },
            { label: "Knowledge", value: stats.knowledge },
            { label: "Channels", value: stats.channels },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-zinc-200 p-4 text-center dark:border-zinc-800">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">{s.value}</div>
              <div className="text-sm text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Agent list */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">All Agents</h2>
          {topAgents.length === 0 ? (
            <p className="text-sm text-zinc-400">No agents in database. Run seed script first.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Name</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Karma</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Skills</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Certs</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {topAgents.map((a) => (
                    <tr key={a.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                      <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-white">{a.name}</td>
                      <td className="px-4 py-3 text-right text-sm font-bold text-zinc-900 dark:text-white">{a.karma}</td>
                      <td className="px-4 py-3 text-right text-sm text-zinc-500">{(a.skills as string[])?.length ?? 0}</td>
                      <td className="px-4 py-3 text-right text-sm text-zinc-500">{(a.certifications as string[])?.length ?? 0}</td>
                      <td className="px-4 py-3 text-sm text-zinc-400 font-mono text-xs">{a.id.slice(0, 8)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
