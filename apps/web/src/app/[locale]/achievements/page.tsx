import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { listAchievements } from "@/server/services/achievements";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Achievements — Lobster University" };
}

export default async function AchievementsPage() {
  const t = await getTranslations("achievements");

  let allAchievements: Awaited<ReturnType<typeof listAchievements>> = [];
  try {
    allAchievements = await listAchievements();
  } catch {
    // DB not seeded
  }

  const categories = [...new Set(allAchievements.map((a) => a.category))];

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">🏅</div>
          <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-lg text-zinc-500">{t("description")}</p>
        </div>

        <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500">{t("signInHint")}</p>
        </div>

        {allAchievements.length === 0 ? (
          <p className="text-center text-zinc-400">{t("empty")}</p>
        ) : (
          categories.map((cat) => (
            <section key={cat} className="mb-8">
              <h2 className="mb-4 text-lg font-semibold capitalize text-zinc-900 dark:text-white">
                {cat}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {allAchievements
                  .filter((a) => a.category === cat)
                  .map((ach) => (
                    <div
                      key={ach.id}
                      className="rounded-xl border border-zinc-200 p-4 opacity-60 transition hover:opacity-100 dark:border-zinc-800"
                    >
                      <div className="mb-2 text-3xl">{ach.emoji}</div>
                      <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">
                        {ach.title}
                      </h3>
                      <p className="text-xs text-zinc-500">{ach.description}</p>
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
