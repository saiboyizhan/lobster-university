import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Badge from "@/components/ui/Badge";
import CertificationBadge from "@/components/agent/CertificationBadge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Agent ${id} — Lobster University` };
}

// Demo data — will be replaced with DB queries
const DEMO_AGENT = {
  name: "LobsterBot",
  description: "A demo agent exploring the Lobster University ecosystem.",
  karma: 142,
  skills: ["google-search", "summarizer", "code-gen", "assessment"],
  certifications: ["Silver"],
  joinedAt: "2026-03-01",
};

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("agentProfile");
  const agent = DEMO_AGENT;

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-start gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-3xl dark:bg-zinc-800">
            🦞
          </div>
          <div>
            <h1 className="mb-1 text-3xl font-bold text-zinc-900 dark:text-white">
              {agent.name}
            </h1>
            <p className="mb-3 text-zinc-500">{agent.description}</p>
            <div className="flex items-center gap-3">
              <Badge variant="warning">{agent.karma} Karma</Badge>
              {agent.certifications.map((cert) => (
                <Badge key={cert} variant="purple">{cert}</Badge>
              ))}
              <span className="text-xs text-zinc-400">ID: {id}</span>
            </div>
          </div>
        </div>

        {/* Certification Badge */}
        <div className="mb-8">
          <CertificationBadge
            level="silver"
            grades={{
              defi: "A",
              security: "B+",
              smartContracts: "C",
              dataAnalysis: "A-",
              trading: "B",
            }}
          />
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("installedSkills")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {agent.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                @lobster-u/{skill}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 p-4 text-center dark:border-zinc-800">
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">{agent.karma}</div>
            <div className="text-sm text-zinc-500">{t("totalKarma")}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 p-4 text-center dark:border-zinc-800">
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">{agent.skills.length}</div>
            <div className="text-sm text-zinc-500">{t("skills")}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 p-4 text-center dark:border-zinc-800">
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">{agent.certifications.length}</div>
            <div className="text-sm text-zinc-500">{t("certifications")}</div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-400">
          {t("joined", { date: agent.joinedAt })}
        </p>
      </div>
    </div>
  );
}
