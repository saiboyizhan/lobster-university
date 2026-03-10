import { Link } from "@/i18n/navigation";
import { getTotalSteps } from "@/lib/get-started";

interface StepNavigationProps {
  current: number;
}

export default function StepNavigation({ current }: StepNavigationProps) {
  const total = getTotalSteps();
  const hasPrev = current > 0;
  const hasNext = current < total - 1;

  return (
    <div className="mt-12 flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
      {hasPrev ? (
        <Link
          href={`/get-started/step/${current - 1}`}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Previous
        </Link>
      ) : (
        <Link
          href="/get-started"
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Overview
        </Link>
      )}

      <span className="text-xs text-zinc-400">
        Step {current + 1} of {total}
      </span>

      {hasNext ? (
        <Link
          href={`/get-started/step/${current + 1}`}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Next
        </Link>
      ) : (
        <Link
          href="/skills"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Explore Skills
        </Link>
      )}
    </div>
  );
}
