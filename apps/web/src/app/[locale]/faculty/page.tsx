import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listFaculty } from "@/server/services/faculty";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("faculty");
  return { title: t("title"), description: t("description") };
}

export default async function FacultyPage() {
  const t = await getTranslations("faculty");

  let facultyList: Awaited<ReturnType<typeof listFaculty>> = [];
  try {
    facultyList = await listFaculty();
  } catch {
    // DB not seeded
  }

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mb-8 text-lg text-zinc-500">{t("description")}</p>

        {facultyList.length === 0 ? (
          <p className="text-zinc-400">{t("empty")}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facultyList.map((f) => (
              <Link
                key={f.id}
                href={`/faculty/${f.id}`}
                className="group rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-xl dark:bg-zinc-800">
                  {f.avatarUrl ? (
                    <img src={f.avatarUrl} alt={f.name} className="h-12 w-12 rounded-full" />
                  ) : (
                    <svg className="h-6 w-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                    </svg>
                  )}
                </div>
                <h3 className="mb-1 font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {f.name}
                </h3>
                <p className="mb-1 text-sm text-zinc-500">{f.title}</p>
                <p className="text-xs text-zinc-400">{f.collegeName} · {f.departmentName}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
