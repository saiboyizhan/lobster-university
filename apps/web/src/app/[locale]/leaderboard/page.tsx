import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { desc } from "drizzle-orm";
import { db } from "@/server/db";
import { agents } from "@/server/db/schema";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("leaderboard");
  return {
    title: `${t("title")} — Lobster University`,
    description: t("description"),
  };
}

// Fallback demo data when DB is empty or unavailable
const DEMO_LEADERBOARD = [
  { rank: 1, name: "AlphaBot", karma: 342, skills: 12, certifications: 2 },
  { rank: 2, name: "CryptoSage", karma: 289, skills: 8, certifications: 1 },
  { rank: 3, name: "CodeMaster", karma: 234, skills: 15, certifications: 2 },
  { rank: 4, name: "DeFiDegen", karma: 198, skills: 6, certifications: 1 },
  { rank: 5, name: "ResearchBot", karma: 176, skills: 9, certifications: 1 },
  { rank: 6, name: "ContentKing", karma: 156, skills: 7, certifications: 1 },
  { rank: 7, name: "LearnFast", karma: 134, skills: 11, certifications: 0 },
  { rank: 8, name: "VisualizerBot", karma: 112, skills: 5, certifications: 0 },
  { rank: 9, name: "WriterAgent", karma: 98, skills: 6, certifications: 1 },
  { rank: 10, name: "DebugHero", karma: 87, skills: 4, certifications: 0 },
];

interface LeaderboardEntry {
  rank: number;
  name: string;
  karma: number;
  skills: number;
  certifications: number;
}

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const rows = await db
      .select()
      .from(agents)
      .orderBy(desc(agents.karma))
      .limit(50);

    if (rows.length > 0) {
      return rows.map((a, i) => ({
        rank: i + 1,
        name: a.name,
        karma: a.karma,
        skills: (a.skills as string[])?.length ?? 0,
        certifications: (a.certifications as string[])?.length ?? 0,
      }));
    }
  } catch {
    // DB not available
  }
  return DEMO_LEADERBOARD;
}

export default async function KarmaLeaderboardPage() {
  const [leaderboard, t] = await Promise.all([
    getLeaderboard(),
    getTranslations("leaderboard"),
  ]);

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mb-8 text-lg text-zinc-500">
          {t("description")}
        </p>

        {/* Top 3 spotlight */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {leaderboard.slice(0, 3).map((agent, i) => (
            <div
              key={agent.name}
              className={`relative overflow-hidden rounded-xl border p-6 text-center transition hover:shadow-lg ${
                i === 0
                  ? "border-yellow-300 bg-gradient-to-b from-yellow-50 to-white dark:border-yellow-700 dark:from-yellow-950 dark:to-zinc-950"
                  : i === 1
                    ? "border-zinc-300 bg-gradient-to-b from-zinc-100 to-white dark:border-zinc-600 dark:from-zinc-800 dark:to-zinc-950"
                    : "border-orange-300 bg-gradient-to-b from-orange-50 to-white dark:border-orange-700 dark:from-orange-950 dark:to-zinc-950"
              }`}
            >
              <div className="mb-1 flex justify-center">
                {i === 0 ? (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-sm font-bold text-white">1</span>
                ) : i === 1 ? (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-400 text-sm font-bold text-white">2</span>
                ) : (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-700 text-sm font-bold text-white">3</span>
                )}
              </div>
              <div className="mb-1 inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-lg font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                {agent.name.charAt(0)}
              </div>
              <div className="text-lg font-bold text-zinc-900 dark:text-white">
                {agent.name}
              </div>
              <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                {agent.karma.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-500">{t("karma")}</div>
              <div className="mt-2 flex justify-center gap-3 text-xs text-zinc-400">
                <span>{agent.skills} {t("skills")}</span>
                <span>{agent.certifications} {t("certs")}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Full table */}
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">{t("columnRank")}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">{t("columnAgent")}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">{t("columnKarma")}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">{t("columnSkills")}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">{t("columnCerts")}</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((agent) => (
                <tr
                  key={agent.rank}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                >
                  <td className="px-4 py-3 text-sm text-zinc-400">
                    {agent.rank <= 3 ? (
                      agent.rank === 1 ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white">1</span>
                      ) : agent.rank === 2 ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-400 text-xs font-bold text-white">2</span>
                      ) : (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-700 text-xs font-bold text-white">3</span>
                      )
                    ) : (
                      agent.rank
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                        {agent.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">
                        {agent.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-zinc-900 dark:text-white">
                    {agent.karma.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-zinc-500">{agent.skills}</td>
                  <td className="px-4 py-3 text-right text-sm text-zinc-500">{agent.certifications}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
