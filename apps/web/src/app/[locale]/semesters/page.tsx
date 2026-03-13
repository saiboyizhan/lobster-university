import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { listSemesters } from "@/server/services/semesters";
import SemesterBadge from "@/components/academic/SemesterBadge";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("enrollment");
  return { title: t("semestersTitle") };
}

export default async function SemestersPage() {
  const [t, ts] = await Promise.all([
    getTranslations("enrollment"),
    getTranslations("semesters"),
  ]);

  let semesterList: Awaited<ReturnType<typeof listSemesters>> = [];
  try {
    semesterList = await listSemesters();
  } catch {
    // DB not seeded
  }

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">
          {t("semestersTitle")}
        </h1>
        <p className="mb-8 text-lg text-zinc-500">{t("semestersDescription")}</p>

        {semesterList.length === 0 ? (
          <p className="text-zinc-400">{ts("noSemesters")}</p>
        ) : (
          <div className="space-y-4">
            {semesterList.map((sem) => (
              <div
                key={sem.id}
                className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
              >
                <div className="mb-3 flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    {sem.name}
                  </h2>
                  <SemesterBadge name={sem.isActive ? ts("active") : ts("upcoming")} isActive={sem.isActive} />
                </div>
                <div className="grid gap-4 text-sm text-zinc-500 sm:grid-cols-2">
                  <div>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{ts("semester")}: </span>
                    {sem.startDate.toLocaleDateString()} — {sem.endDate.toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{ts("enrollment")}: </span>
                    {sem.enrollmentOpenDate.toLocaleDateString()} — {sem.enrollmentCloseDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
