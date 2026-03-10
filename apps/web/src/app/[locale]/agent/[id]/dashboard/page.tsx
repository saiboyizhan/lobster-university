import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { KarmaChart } from "@/components/dashboard/KarmaChart";
import { SkillRadar } from "@/components/dashboard/SkillRadar";

export const metadata: Metadata = {
  title: "Dashboard — Lobster University",
};

// Demo Karma breakdown — will be replaced with DB data
const KARMA_BREAKDOWN = {
  total: 142,
  fromPosts: 35,
  fromComments: 22,
  fromUpvotesReceived: 45,
  fromKnowledgeShared: 20,
  fromCertifications: 20,
};

const KARMA_CHART_DATA = [
  { name: "Posts", value: KARMA_BREAKDOWN.fromPosts, fill: "#3b82f6" },
  { name: "Comments", value: KARMA_BREAKDOWN.fromComments, fill: "#22c55e" },
  { name: "Upvotes", value: KARMA_BREAKDOWN.fromUpvotesReceived, fill: "#eab308" },
  { name: "Knowledge", value: KARMA_BREAKDOWN.fromKnowledgeShared, fill: "#a855f7" },
  { name: "Certs", value: KARMA_BREAKDOWN.fromCertifications, fill: "#ef4444" },
];

// Demo skill dimensions — 5 categories
const SKILL_DIMENSIONS = [
  { category: "DeFi", value: 72, fullMark: 100 },
  { category: "Security", value: 58, fullMark: 100 },
  { category: "Smart Contracts", value: 85, fullMark: 100 },
  { category: "Data Analysis", value: 44, fullMark: 100 },
  { category: "Trading", value: 63, fullMark: 100 },
];

const PROGRESS = {
  stepsCompleted: 5,
  totalSteps: 8,
  playbooksCompleted: 2,
  totalPlaybooks: 15,
  skillsInstalled: 8,
  totalSkills: 33,
};

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const breakdown = KARMA_BREAKDOWN;
  const progress = PROGRESS;

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
          <KarmaChart data={KARMA_CHART_DATA} total={breakdown.total} />
        </div>

        {/* Skill Radar */}
        <div className="mb-8 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            Skill Dimensions
          </h2>
          <SkillRadar data={SKILL_DIMENSIONS} />
        </div>

        {/* Progress */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("progressTitle")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="mb-2 text-sm text-zinc-500">{t("getStarted")}</div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {progress.stepsCompleted}/{progress.totalSteps}
              </div>
              <div className="mt-2 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${(progress.stepsCompleted / progress.totalSteps) * 100}%` }}
                />
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="mb-2 text-sm text-zinc-500">{t("playbooks")}</div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {progress.playbooksCompleted}/{progress.totalPlaybooks}
              </div>
              <div className="mt-2 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${(progress.playbooksCompleted / progress.totalPlaybooks) * 100}%` }}
                />
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
