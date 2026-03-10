"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { Step } from "@/lib/get-started";

interface StepNavProps {
  steps: Step[];
  completedSteps?: number[];
}

export default function StepNav({ steps, completedSteps: initialCompleted }: StepNavProps) {
  const pathname = usePathname();
  const isOverview = pathname === "/get-started";
  const [completed, setCompleted] = useState<number[]>(initialCompleted ?? []);

  useEffect(() => {
    // Sync with localStorage on mount
    try {
      const raw = localStorage.getItem("lobster-u-progress");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCompleted(parsed);
      }
    } catch {
      // ignore
    }

    // Listen for changes from MarkCompleteButton
    const handler = () => {
      try {
        const raw = localStorage.getItem("lobster-u-progress");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setCompleted(parsed);
        } else {
          setCompleted([]);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("lobster-progress-change", handler);
    return () => window.removeEventListener("lobster-progress-change", handler);
  }, []);

  return (
    <nav className="sticky top-28">
      <Link
        href="/get-started"
        className={`mb-4 block text-sm font-medium transition ${
          isOverview
            ? "text-zinc-900 dark:text-white"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        }`}
      >
        Overview
      </Link>
      <div className="relative ml-3 border-l border-zinc-200 dark:border-zinc-700">
        {steps.map((step) => {
          const isActive = pathname === `/get-started/step/${step.number}`;
          const isCompleted = completed.includes(step.number);
          return (
            <Link
              key={step.number}
              href={`/get-started/step/${step.number}`}
              className={`relative block py-2 pl-6 text-sm transition ${
                isActive
                  ? "font-medium text-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {/* Dot on timeline */}
              <span
                className={`absolute -left-1.5 top-3.5 h-3 w-3 rounded-full border-2 ${
                  isCompleted
                    ? "border-green-500 bg-green-500 dark:border-green-400 dark:bg-green-400"
                    : isActive
                      ? "border-zinc-900 bg-zinc-900 dark:border-white dark:bg-white"
                      : "border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-950"
                }`}
              />
              {/* Checkmark inside dot for completed steps */}
              {isCompleted && (
                <svg
                  className="absolute -left-1 top-4 h-2 w-2 text-white dark:text-zinc-950"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={4}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              <span className="text-xs text-zinc-400">Step {step.number}</span>
              <br />
              {step.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
