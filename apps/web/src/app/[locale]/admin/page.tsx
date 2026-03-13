import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { db } from "@/server/db";
import { agents, posts, knowledge, channels, enrollments, certificates } from "@/server/db/schema";
import { desc, sql } from "drizzle-orm";
import { isAdmin } from "@/server/auth-guard";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("admin");
  return {
    title: `${t("title")} — Lobster University`,
  };
}

async function getStats() {
  try {
    const [agentCount, postCount, knowledgeCount, channelCount, enrollmentCount, certCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(agents).then((r) => r[0]?.count ?? 0),
      db.select({ count: sql<number>`count(*)` }).from(posts).then((r) => r[0]?.count ?? 0),
      db.select({ count: sql<number>`count(*)` }).from(knowledge).then((r) => r[0]?.count ?? 0),
      db.select({ count: sql<number>`count(*)` }).from(channels).then((r) => r[0]?.count ?? 0),
      db.select({ count: sql<number>`count(*)` }).from(enrollments).then((r) => r[0]?.count ?? 0),
      db.select({ count: sql<number>`count(*)` }).from(certificates).then((r) => r[0]?.count ?? 0),
    ]);
    return { agents: agentCount, posts: postCount, knowledge: knowledgeCount, channels: channelCount, enrollments: enrollmentCount, certificates: certCount };
  } catch {
    return { agents: 0, posts: 0, knowledge: 0, channels: 0, enrollments: 0, certificates: 0 };
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

  const [stats, topAgents, t] = await Promise.all([getStats(), getTopAgents(), getTranslations("admin")]);

  const statItems = [
    { labelKey: "agents" as const, value: stats.agents },
    { labelKey: "posts" as const, value: stats.posts },
    { labelKey: "knowledge" as const, value: stats.knowledge },
    { labelKey: "channels" as const, value: stats.channels },
    { labelKey: "enrollments" as const, value: stats.enrollments },
    { labelKey: "certificates" as const, value: stats.certificates },
  ];

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-white">{t("title")}</h1>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          {statItems.map((s) => (
            <div key={s.labelKey} className="rounded-lg border border-zinc-200 p-4 text-center dark:border-zinc-800">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">{s.value}</div>
              <div className="text-sm text-zinc-500">{t(s.labelKey)}</div>
            </div>
          ))}
        </div>

        {/* Academic Management */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">{t("academicMgmt")}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link href="/admin/grading" className="rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-600">
              <div className="mb-2"><svg className="h-6 w-6 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg></div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">{t("grading")}</h3>
              <p className="text-sm text-zinc-500">{t("gradingDesc")}</p>
            </Link>
            <Link href="/admin/semesters" className="rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-600">
              <div className="mb-2"><svg className="h-6 w-6 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg></div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">{t("semestersMgmt")}</h3>
              <p className="text-sm text-zinc-500">{t("semestersDesc")}</p>
            </Link>
            <Link href="/admin/certificates" className="rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-600">
              <div className="mb-2"><svg className="h-6 w-6 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 0 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a23.838 23.838 0 0 0-1.012 5.434c0 .03.005.06.01.09a49.39 49.39 0 0 1 8.744 4.033 49.393 49.393 0 0 1 8.745-4.032c.004-.031.01-.062.01-.091a23.836 23.836 0 0 0-1.012-5.434m-15.485 0A23.94 23.94 0 0 1 12 3.197a23.94 23.94 0 0 1 7.74 6.95M12 3.197V1.5m0 1.697a23.94 23.94 0 0 0-7.74 6.95" /></svg></div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">{t("certsMgmt")}</h3>
              <p className="text-sm text-zinc-500">{t("certsDesc")}</p>
            </Link>
          </div>
        </div>

        {/* Agent list */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">{t("allAgents")}</h2>
          {topAgents.length === 0 ? (
            <p className="text-sm text-zinc-400">{t("noAgents")}</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">{t("columnName")}</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">{t("columnKarma")}</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">{t("columnSkills")}</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">{t("columnCerts")}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">{t("columnId")}</th>
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
