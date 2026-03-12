import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listAvailableMentors } from "@/server/services/mentors";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Mentors — Lobster University" };
}

export default async function MentorsPage() {
  const t = await getTranslations("mentors");

  let mentors: Awaited<ReturnType<typeof listAvailableMentors>> = [];
  try {
    mentors = await listAvailableMentors();
  } catch {
    // DB not seeded
  }

  // Group by course
  const byCourse = new Map<string, typeof mentors>();
  for (const m of mentors) {
    const key = m.courseCode;
    const existing = byCourse.get(key) ?? [];
    existing.push(m);
    byCourse.set(key, existing);
  }

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">🧑‍🏫</div>
          <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-lg text-zinc-500">{t("description")}</p>
        </div>

        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-center dark:border-blue-800 dark:bg-blue-950">
          <p className="text-sm text-blue-700 dark:text-blue-300">{t("eligibility")}</p>
        </div>

        {byCourse.size === 0 ? (
          <p className="text-center text-zinc-400">{t("empty")}</p>
        ) : (
          [...byCourse.entries()].map(([courseCode, courseMentors]) => (
            <section key={courseCode} className="mb-6">
              <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">
                {courseCode} — {courseMentors[0].courseTitle}
              </h2>
              <div className="space-y-2">
                {courseMentors.slice(0, 5).map((m) => (
                  <div
                    key={`${m.agentId}-${m.courseId}`}
                    className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-800"
                  >
                    <Link
                      href={`/agent/${m.agentId}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {m.agentName}
                    </Link>
                    <span className="text-sm text-zinc-500">{t("grade")}: {m.grade ?? "—"}</span>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
