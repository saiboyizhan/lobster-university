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
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex justify-center">
              <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
              </svg>
            </div>
            <p className="mb-2 text-lg font-medium text-zinc-600 dark:text-zinc-400">{t("empty")}</p>
            <p className="text-sm text-zinc-400">Run db:seed to populate colleges</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collegeList.map((college) => (
              <Link
                key={college.id}
                href={`/colleges/${college.slug}`}
                className="group relative overflow-hidden rounded-xl border border-zinc-200 p-6 transition hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:hover:border-zinc-700"
              >
                <div className="pointer-events-none absolute -top-6 -right-6 text-[8rem] font-bold leading-none opacity-[0.06] transition group-hover:opacity-[0.1] dark:opacity-[0.04] dark:group-hover:opacity-[0.08]">
                  {college.iconEmoji}
                </div>
                <div className="relative">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-sm font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{college.iconEmoji}</div>
                  <h2 className="mb-2 text-xl font-semibold text-zinc-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {college.name}
                  </h2>
                  <p className="mb-4 text-sm text-zinc-500 line-clamp-2">
                    {college.description}
                  </p>
                  <div className="flex gap-4 text-xs text-zinc-400">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
                      {college.departmentCount} {t("departments")}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
                      {college.courseCount} {t("courses")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
