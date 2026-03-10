"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "lobster-u-progress";

function readCompletedSteps(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((n) => typeof n === "number")) {
      return parsed;
    }
  } catch {
    // corrupted data — reset
  }
  return [];
}

function writeCompletedSteps(steps: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(steps));
}

export function useCompletedSteps() {
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    setCompleted(readCompletedSteps());
  }, []);

  return completed;
}

interface MarkCompleteButtonProps {
  stepNumber: number;
}

export default function MarkCompleteButton({ stepNumber }: MarkCompleteButtonProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const steps = readCompletedSteps();
    setCompleted(steps.includes(stepNumber));
  }, [stepNumber]);

  const toggle = useCallback(() => {
    const steps = readCompletedSteps();
    let updated: number[];
    if (steps.includes(stepNumber)) {
      updated = steps.filter((n) => n !== stepNumber);
    } else {
      updated = [...steps, stepNumber].sort((a, b) => a - b);
    }
    writeCompletedSteps(updated);
    setCompleted(updated.includes(stepNumber));
    // Dispatch storage event so StepNav can react
    window.dispatchEvent(new Event("lobster-progress-change"));
  }, [stepNumber]);

  return (
    <button
      onClick={toggle}
      className={`mt-8 flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition ${
        completed
          ? "border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-700 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900"
          : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
      }`}
    >
      {completed ? (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Completed
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="9" />
          </svg>
          Mark as Complete
        </>
      )}
    </button>
  );
}
