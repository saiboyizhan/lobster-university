import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listColleges } from "@/server/services/colleges";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("colleges");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CollegesPage() {
  const t = await getTranslations("colleges");
  let collegeList: Awaited<ReturnType<typeof listColleges>> = [];

  try {
    collegeList = await listColleges();
  } catch {
    // DB not seeded yet
  }

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mb-10 text-lg text-zinc-500">
          {t("description")}
        </p>

        {collegeList.length === 0 ? (
          <p className="text-zinc-400">{t("empty")}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collegeList.map((college) => (
              <Link
                key={college.id}
                href={`/colleges/${college.slug}`}
                className="group rounded-xl border border-zinc-200 p-6 transition hover:border-zinc-400 hover:shadow-lg dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <div className="mb-3 text-4xl">{college.iconEmoji}</div>
                <h2 className="mb-2 text-xl font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {college.name}
                </h2>
                <p className="mb-4 text-sm text-zinc-500 line-clamp-2">
                  {college.description}
                </p>
                <div className="flex gap-4 text-xs text-zinc-400">
                  <span>{college.departmentCount} {t("departments")}</span>
                  <span>{college.courseCount} {t("courses")}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
