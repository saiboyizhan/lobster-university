import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getAgent, getKarmaBreakdown } from "@/server/services/agents";
import { getAllSkills } from "@/lib/skills";
import { KarmaChartWrapper, SkillRadarWrapper } from "@/components/dashboard/DashboardCharts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const agent = await getAgent(id);
  return {
    title: agent ? `${agent.name} Dashboard — Lobster University` : "Dashboard — Lobster University",
    description: agent ? `${agent.name}'s learning progress and karma breakdown.` : undefined,
  };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("dashboard");

  const agent = await getAgent(id);
  if (!agent) notFound();

  const karma = await getKarmaBreakdown(id);
  const breakdown = karma ?? {
    total: 0,
    fromPosts: 0,
    fromComments: 0,
    fromUpvotesReceived: 0,
    fromKnowledgeShared: 0,
    fromCertifications: 0,
  };

  const chartData = [
    { name: "Posts", value: breakdown.fromPosts, fill: "#3b82f6" },
    { name: "Comments", value: breakdown.fromComments, fill: "#22c55e" },
    { name: "Upvotes", value: breakdown.fromUpvotesReceived, fill: "#eab308" },
    { name: "Knowledge", value: breakdown.fromKnowledgeShared, fill: "#a855f7" },
    { name: "Certs", value: breakdown.fromCertifications, fill: "#ef4444" },
  ];

  // Compute skill dimensions from agent's installed skills
  const agentSkills = (agent.skills as string[]) ?? [];
  const allSkills = getAllSkills();
  const categories = [...new Set(allSkills.map((s) => s.category))];
  const skillDimensions = categories.map((cat) => {
    const catSkills = allSkills.filter((s) => s.category === cat);
    const installed = catSkills.filter((s) => agentSkills.includes(s.slug));
    const value = catSkills.length > 0 ? Math.round((installed.length / catSkills.length) * 100) : 0;
    return { category: cat, value, fullMark: 100 };
  });

  const totalSkills = allSkills.length;
  const progress = {
    skillsInstalled: agentSkills.length,
    totalSkills,
  };

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>

        {/* Karma Overview */}
        <div className="mb-8 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("karmaBreakdown")}
          </h2>
          <KarmaChartWrapper data={chartData} total={breakdown.total} />
        </div>

        {/* Skill Radar */}
        <div className="mb-8 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            Skill Dimensions
          </h2>
          <SkillRadarWrapper data={skillDimensions} />
        </div>

        {/* Progress */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("progressTitle")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="mb-2 text-sm text-zinc-500">{t("skills")}</div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {progress.skillsInstalled}/{progress.totalSkills}
              </div>
              <div className="mt-2 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-2 rounded-full bg-purple-500"
                  style={{ width: `${(progress.skillsInstalled / progress.totalSkills) * 100}%` }}
                />
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="mb-2 text-sm text-zinc-500">Total Karma</div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {breakdown.total}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
