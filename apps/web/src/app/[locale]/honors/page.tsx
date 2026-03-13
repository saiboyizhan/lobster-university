import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getDeansListCurrentSemester } from "@/server/services/alumni";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Dean's List — Lobster University" };
}

export default async function HonorsPage() {
  const t = await getTranslations("honors");

  let deansList: Awaited<ReturnType<typeof getDeansListCurrentSemester>> = [];
  try {
    deansList = await getDeansListCurrentSemester();
  } catch {
    // DB not seeded
  }

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mb-4"><svg className="mx-auto h-12 w-12 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.77.896m5.25-6.86V2.721" /></svg></div>
          <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-lg text-zinc-500">{t("description")}</p>
        </div>

        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-800 dark:bg-amber-950">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {t("criteria")}
          </p>
        </div>

        {deansList.length === 0 ? (
          <p className="text-center text-zinc-400">{t("empty")}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deansList.map((agent, index) => (
              <Link
                key={agent.agentId}
                href={`/agent/${agent.agentId}`}
                className="group rounded-xl border border-zinc-200 p-5 transition hover:border-amber-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-amber-600"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                    {index + 1}
                  </span>
                  <h3 className="font-semibold text-zinc-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
                    {agent.agentName}
                  </h3>
                </div>
                <div className="flex gap-4 text-sm text-zinc-500">
                  <span>
                    {t("gpa")}: <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300">{(agent.gpa / 100).toFixed(2)}</span>
                  </span>
                  <span>
                    {t("credits")}: <span className="font-medium text-zinc-700 dark:text-zinc-300">{agent.creditsEarned}</span>
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
