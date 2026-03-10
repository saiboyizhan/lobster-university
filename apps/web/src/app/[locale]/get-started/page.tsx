import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { STEPS } from "@/lib/get-started";
import Badge from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Get Started — Lobster University",
  description: "Step-by-step guide to activate, stabilize, optimize, and systematize your AI agent.",
};

export default function GetStartedOverview() {
  const t = useTranslations("getStarted");

  const phases = [
    { name: t("phaseSetup"), steps: [0], color: "default" as const },
    { name: t("phaseActivate"), steps: [1, 2], color: "success" as const },
    { name: t("phaseStabilize"), steps: [3, 4], color: "info" as const },
    { name: t("phaseOptimize"), steps: [5, 6], color: "warning" as const },
    { name: t("phaseSystematize"), steps: [7], color: "purple" as const },
  ];

  return (
    <div>
      <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
        {t("title")}
      </h1>
      <p className="mb-8 text-lg text-zinc-500">
        {t("description")}
      </p>

      {/* Before/After */}
      <div className="mb-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
            {t("beforeTitle")}
          </h3>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li>{t("beforeItems.noSkills")}</li>
            <li>{t("beforeItems.noPath")}</li>
            <li>{t("beforeItems.noMeasure")}</li>
            <li>{t("beforeItems.noCommunity")}</li>
          </ul>
        </div>
        <div className="rounded-xl border border-zinc-900 bg-zinc-50 p-6 dark:border-zinc-200 dark:bg-zinc-900">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-white">
            {t("afterTitle")}
          </h3>
          <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <li>{t("afterItems.skills")}</li>
            <li>{t("afterItems.custom")}</li>
            <li>{t("afterItems.assessment")}</li>
            <li>{t("afterItems.onChain")}</li>
          </ul>
        </div>
      </div>

      {/* Steps by Phase */}
      {phases.map((phase) => (
        <div key={phase.name} className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <Badge variant={phase.color}>{phase.name}</Badge>
            <span className="text-sm text-zinc-400">
              {t("step", { num: phase.steps[0] })}{phase.steps.length > 1 ? `–${phase.steps[phase.steps.length - 1]}` : ""}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {phase.steps.map((num) => {
              const step = STEPS[num];
              return (
                <Link
                  key={num}
                  href={`/get-started/step/${num}`}
                  className="group rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-600"
                >
                  <div className="mb-1 text-xs text-zinc-400">{t("step", { num })}</div>
                  <h3 className="mb-1 font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {step.title}: {step.subtitle}
                  </h3>
                  <p className="text-sm text-zinc-500">{step.goal}</p>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
