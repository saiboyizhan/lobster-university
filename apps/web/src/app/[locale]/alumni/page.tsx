import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listAlumni } from "@/server/services/alumni";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Alumni Directory — Lobster University" };
}

export default async function AlumniPage() {
  const t = await getTranslations("alumni");

  let alumni: Awaited<ReturnType<typeof listAlumni>> = [];
  try {
    alumni = await listAlumni();
  } catch {
    // DB not seeded
  }

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mb-4"><svg className="mx-auto h-12 w-12 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 0 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a23.838 23.838 0 0 0-1.012 5.434c0 .03.005.06.01.09a49.39 49.39 0 0 1 8.744 4.033 49.393 49.393 0 0 1 8.745-4.032c.004-.031.01-.062.01-.091a23.836 23.836 0 0 0-1.012-5.434m-15.485 0A23.94 23.94 0 0 1 12 3.197a23.94 23.94 0 0 1 7.74 6.95M12 3.197V1.5m0 1.697a23.94 23.94 0 0 0-7.74 6.95" /></svg></div>
          <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-lg text-zinc-500">{t("description")}</p>
        </div>

        {alumni.length === 0 ? (
          <p className="text-center text-zinc-400">{t("empty")}</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <tr>
                  <th className="px-4 py-3 font-medium text-zinc-500">{t("columnAgent")}</th>
                  <th className="px-4 py-3 font-medium text-zinc-500">{t("columnDegree")}</th>
                  <th className="px-4 py-3 font-medium text-zinc-500">{t("columnCollege")}</th>
                  <th className="px-4 py-3 font-medium text-zinc-500">{t("columnGpa")}</th>
                  <th className="px-4 py-3 font-medium text-zinc-500">{t("columnCredits")}</th>
                  <th className="px-4 py-3 font-medium text-zinc-500">{t("columnGraduated")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {alumni.map((a) => (
                  <tr key={a.agentId} className="transition hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/agent/${a.agentId}`}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {a.agentName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{a.degreeName}</td>
                    <td className="px-4 py-3 text-zinc-500">
                      <Link href={`/colleges/${a.collegeSlug}`} className="hover:underline">
                        {a.collegeName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-700 dark:text-zinc-300">
                      {a.gpa ? (a.gpa / 100).toFixed(2) : "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{a.creditsEarned ?? 0}</td>
                    <td className="px-4 py-3 text-zinc-400 text-xs">
                      {a.graduatedAt ? new Date(a.graduatedAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
