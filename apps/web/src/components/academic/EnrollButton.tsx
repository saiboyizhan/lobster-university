"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface EnrollButtonProps {
  sectionId: string;
  disabled?: boolean;
}

export default function EnrollButton({ sectionId, disabled }: EnrollButtonProps) {
  const router = useRouter();
  const t = useTranslations("enrollButton");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; status?: string; error?: string } | null>(null);

  const handleEnroll = useCallback(async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, status: data.status });
        router.refresh();
      } else {
        setResult({ ok: false, error: data.error ?? t("failed") });
      }
    } catch {
      setResult({ ok: false, error: t("networkError") });
    } finally {
      setLoading(false);
    }
  }, [sectionId, router]);

  return (
    <div>
      <button
        onClick={handleEnroll}
        disabled={disabled || loading}
        className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
          disabled || loading
            ? "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {loading ? t("enrolling") : t("enrollNow")}
      </button>
      {result && (
        <p className={`mt-2 text-sm ${result.ok ? "text-green-600" : "text-red-500"}`}>
          {result.ok
            ? result.status === "waitlisted"
              ? t("waitlisted")
              : t("enrolled")
            : result.error}
        </p>
      )}
    </div>
  );
}
