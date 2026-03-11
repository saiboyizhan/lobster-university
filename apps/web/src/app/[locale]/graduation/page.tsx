import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listDegreePrograms } from "@/server/services/degrees";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Graduation — Lobster University" };
}

export default async function GraduationPage() {
  const t = await getTranslations("graduation");

  let programs: Awaited<ReturnType<typeof listDegreePrograms>> = [];
  try {
    programs = await listDegreePrograms();
  } catch {
    // DB not seeded
  }

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mb-4 text-6xl">🎓</div>
          <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-lg text-zinc-500">{t("description")}</p>
        </div>

        {/* Sign in prompt */}
        <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-4 text-zinc-500">{t("signInRequired")}</p>
          <Link
            href="/auth/login"
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {t("signIn")}
          </Link>
        </div>

        {/* Available Degree Programs */}
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          {t("availablePrograms")}
        </h2>
        {programs.length === 0 ? (
          <p className="text-zinc-400">{t("noPrograms")}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {programs.map((p) => (
              <Link
                key={p.id}
                href={`/degrees/${p.slug}`}
                className="group rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">{p.collegeEmoji}</span>
                  <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {p.name}
                  </h3>
                </div>
                <p className="mb-2 text-sm text-zinc-500 line-clamp-2">{p.description}</p>
                <div className="flex gap-3 text-xs text-zinc-400">
                  <span>{p.requiredCredits} {t("credits")}</span>
                  <span>{t("minGpa")} {(p.minGpa / 100).toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
