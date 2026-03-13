import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listDegreePrograms } from "@/server/services/degrees";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("degrees");
  return { title: t("title"), description: t("description") };
}

export default async function DegreesPage() {
  const t = await getTranslations("degrees");

  let programs: Awaited<ReturnType<typeof listDegreePrograms>> = [];
  try {
    programs = await listDegreePrograms();
  } catch {
    // DB not seeded
  }

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mb-8 text-lg text-zinc-500">{t("description")}</p>

        {programs.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex justify-center">
              <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </div>
            <p className="mb-2 text-lg font-medium text-zinc-600 dark:text-zinc-400">{t("empty")}</p>
            <p className="text-sm text-zinc-400">Run db:seed to populate degree programs</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {programs.map((p) => (
              <Link
                key={p.id}
                href={`/degrees/${p.slug}`}
                className="group rounded-xl border border-zinc-200 p-6 transition hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:hover:border-zinc-700"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {p.collegeEmoji}
                  </div>
                  <div>
                    <h2 className="font-semibold text-zinc-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {p.name}
                    </h2>
                    <p className="text-sm text-zinc-400">{p.collegeName}</p>
                  </div>
                </div>
                <p className="mb-4 text-sm text-zinc-500 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                  <span className={`rounded-full px-2.5 py-0.5 font-medium ${
                    p.type === "bachelor"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  }`}>
                    {p.type === "bachelor" ? t("typeBachelor") : t("typeCertificate")}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 dark:bg-zinc-800">
                    {p.requiredCredits} {t("credits")}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 dark:bg-zinc-800">
                    {t("minGpa")} {(p.minGpa / 100).toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
