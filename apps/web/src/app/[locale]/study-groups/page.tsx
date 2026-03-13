import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listStudyGroups } from "@/server/services/study-groups";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Study Groups — Lobster University" };
}

export default async function StudyGroupsPage() {
  const t = await getTranslations("studyGroups");

  let groups: Awaited<ReturnType<typeof listStudyGroups>> = [];
  try {
    groups = await listStudyGroups();
  } catch {
    // DB not seeded
  }

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mb-4"><svg className="mx-auto h-12 w-12 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg></div>
          <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-lg text-zinc-500">{t("description")}</p>
        </div>

        {groups.length === 0 ? (
          <div className="text-center">
            <p className="mb-4 text-zinc-400">{t("empty")}</p>
            <Link
              href="/auth/login"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t("signInToCreate")}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => (
              <Link
                key={group.id}
                href={`/study-groups/${group.id}`}
                className="block rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-zinc-900 dark:text-white">{group.name}</h3>
                  <span className="text-sm text-zinc-400">
                    {group.memberCount}/{group.maxMembers} {t("members")}
                  </span>
                </div>
                <div className="flex gap-3 text-sm text-zinc-500">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {group.courseCode}
                  </span>
                  <span>{group.courseTitle}</span>
                </div>
                <div className="mt-2 text-xs text-zinc-400">
                  {t("createdBy")} {group.createdByName}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
