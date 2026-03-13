import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getAgent, getKarmaBreakdown } from "@/server/services/agents";
import { getAllSkills } from "@/lib/skills";
import {
  KarmaChartWrapper,
  SkillRadarWrapper,
  GpaTrendWrapper,
  CreditsProgressWrapper,
  DegreeProgressWrapper,
} from "@/components/dashboard/DashboardCharts";
import { getStudentProfile } from "@/server/services/student-profiles";
import { getAcademicStanding } from "@/server/services/academic-standing";
import { getTranscript } from "@/server/services/grading";
import { getRecommendations } from "@/server/services/advisor";
import GpaDisplay from "@/components/academic/GpaDisplay";
import AcademicStandingBadge from "@/components/academic/AcademicStandingBadge";
import { Link } from "@/i18n/navigation";

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

  // Academic profile, standing, transcript, and degree progress
  let studentProfile: Awaited<ReturnType<typeof getStudentProfile>> | null = null;
  let standing: Awaited<ReturnType<typeof getAcademicStanding>> | null = null;
  let gpaBySemester: { semester: string; gpa: number }[] = [];
  let degreeProgress: {
    programName: string;
    collegeName: string;
    percentComplete: number;
    completedRequirements: number;
    totalRequirements: number;
    requiredCredits: number;
  }[] = [];
  let totalCreditsEarned = 0;

  try {
    studentProfile = await getStudentProfile(id);
    standing = await getAcademicStanding(id);

    const transcript = await getTranscript(id);
    totalCreditsEarned = transcript.totalCreditsEarned;

    // Compute GPA per semester from transcript data
    gpaBySemester = transcript.semesters.map((sem) => {
      const graded = sem.entries.filter((e) => e.gradePoints !== null && e.status === "completed");
      if (graded.length === 0) return { semester: sem.name, gpa: 0 };
      const totalPts = graded.reduce((sum, e) => sum + (e.gradePoints ?? 0) * e.credits, 0);
      const totalCreds = graded.reduce((sum, e) => sum + e.credits, 0);
      const semGpa = totalCreds > 0 ? Math.round(totalPts / totalCreds) : 0;
      return { semester: sem.name, gpa: semGpa };
    });

    const advisorData = await getRecommendations(id);
    degreeProgress = advisorData.degreeProgress;
  } catch {
    // student profile service not seeded yet
  }

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>

        {/* Academic Summary */}
        {studentProfile && (
          <div className="mb-8 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              {t("academicSummary")}
            </h2>
            {standing && (
              <div className="mb-4">
                <AcademicStandingBadge standing={standing.standing} label={standing.label} />
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <div className="mb-1 text-sm text-zinc-500">GPA</div>
                <GpaDisplay gpa={studentProfile.cumulativeGpa} />
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <div className="mb-1 text-sm text-zinc-500">{t("creditsEarned")}</div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {studentProfile.totalCreditsEarned}
                </div>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <div className="mb-1 text-sm text-zinc-500">{t("statusLabel")}</div>
                <div className="text-lg font-semibold capitalize text-zinc-900 dark:text-white">
                  {studentProfile.enrollmentStatus}
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Link
                href="/my-courses"
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {t("myCourses")}
              </Link>
              <Link
                href="/transcript"
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {t("transcript")}
              </Link>
              <Link
                href="/advisor"
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {t("advisorLink")}
              </Link>
            </div>
          </div>
        )}

        {/* Charts Grid: GPA Trend + Credits Progress */}
        {studentProfile && (
          <div className="mb-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 p-6 lg:col-span-2 dark:border-zinc-800">
              <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
                {t("gpaBySemester")}
              </h2>
              <GpaTrendWrapper data={gpaBySemester} cumulativeGpa={studentProfile.cumulativeGpa} />
            </div>
            <div className="flex items-center justify-center rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
              <CreditsProgressWrapper
                earned={totalCreditsEarned}
                required={degreeProgress.length > 0 ? degreeProgress[0].requiredCredits : 30}
                label={t("creditsProgress")}
              />
            </div>
          </div>
        )}

        {/* Degree Progress */}
        {degreeProgress.length > 0 && (
          <div className="mb-8 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              {t("degreeProgress")}
            </h2>
            <DegreeProgressWrapper data={degreeProgress} />
          </div>
        )}

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
            {t("skillDimensions")}
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
              <div className="mb-2 text-sm text-zinc-500">{t("totalKarma")}</div>
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
