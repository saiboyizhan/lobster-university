import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getStep, STEPS } from "@/lib/get-started";
import CodeBlock from "@/components/ui/CodeBlock";
import Badge from "@/components/ui/Badge";
import StepNavigation from "@/components/get-started/StepNavigation";
import MarkCompleteButton from "@/components/get-started/ProgressTracker";

export function generateStaticParams() {
  return STEPS.map((s) => ({ step: String(s.number) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ step: string }>;
}): Promise<Metadata> {
  const { step: stepStr } = await params;
  const step = getStep(Number(stepStr));
  const t = await getTranslations("stepDetail");
  if (!step) return { title: t("notFound") };
  return {
    title: `Step ${step.number}: ${step.title} — Lobster University`,
  };
}

export default async function StepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step: stepStr } = await params;
  const stepNumber = Number(stepStr);
  const step = getStep(stepNumber);
  if (!step) notFound();

  const [t, tgs] = await Promise.all([
    getTranslations("stepDetail"),
    getTranslations("getStarted"),
  ]);

  const phaseVariant =
    step.phase === "Setup"
      ? "default"
      : step.phase === "Activate"
        ? "success"
        : step.phase === "Stabilize"
          ? "info"
          : step.phase === "Optimize"
            ? "warning"
            : "purple";

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
          <span>{tgs("step", { num: step.number + 1 })} / {STEPS.length}</span>
          <span>{Math.round(((step.number + 1) / STEPS.length) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-2 rounded-full bg-zinc-900 transition-all dark:bg-white"
            style={{ width: `${((step.number + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <Badge variant={phaseVariant as "default" | "success" | "info" | "warning" | "purple"}>
            {step.phase}
          </Badge>
          <span className="text-sm text-zinc-400">{tgs("step", { num: step.number })}</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
          {step.title}
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">{step.subtitle}</p>
      </div>

      {/* Goal */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
          {t("goal")}
        </h2>
        <p className="text-zinc-700 dark:text-zinc-300">{step.goal}</p>
      </div>

      {/* Benefit */}
      <div className="mb-8">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
          {t("whyMatters")}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">{step.benefit}</p>
      </div>

      {/* Tasks */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          {t("tasks")}
        </h2>
        <ul className="space-y-3">
          {step.tasks.map((task, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-xs text-zinc-400 dark:border-zinc-600">
                {i + 1}
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{task}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Code Example */}
      {step.codeExample && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("code")}
          </h2>
          <CodeBlock code={step.codeExample} title="terminal" />
        </div>
      )}

      {/* Expected Output */}
      <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-700 dark:text-green-300">
          {t("expectedOutput")}
        </h2>
        <p className="text-green-800 dark:text-green-200">{step.expectedOutput}</p>
      </div>

      {/* Mark Complete */}
      <MarkCompleteButton stepNumber={step.number} />

      {/* Navigation */}
      <StepNavigation current={step.number} />
    </div>
  );
}
