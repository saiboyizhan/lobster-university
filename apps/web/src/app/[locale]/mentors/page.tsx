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
          <div className="mb-4 flex justify-center">
            <svg className="h-12 w-12 text-zinc-600 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </div>
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
