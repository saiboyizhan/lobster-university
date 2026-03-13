import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getFaculty } from "@/server/services/faculty";
import { getInstructorRatingStats } from "@/server/services/course-reviews";
import { listOfficeHoursForFaculty } from "@/server/services/office-hours";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const member = await getFaculty(id);
  return {
    title: member ? `${member.name} — Faculty — Lobster University` : "Faculty — Lobster University",
  };
}

export default async function FacultyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("faculty");
  const member = await getFaculty(id);
  if (!member) notFound();

  let ratingStats = { avgRating: 0, reviewCount: 0 };
  let hours: Awaited<ReturnType<typeof listOfficeHoursForFaculty>> = [];
  try {
    ratingStats = await getInstructorRatingStats(id);
    hours = await listOfficeHoursForFaculty(id);
  } catch {
    // DB not seeded
  }

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <nav className="mb-6 text-sm text-zinc-400">
          <Link href="/faculty" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            {t("title")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600 dark:text-zinc-300">{member.name}</span>
        </nav>

        <div className="mb-8 flex items-start gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            {member.avatarUrl ? (
              <img src={member.avatarUrl} alt={member.name} className="h-20 w-20 rounded-full" />
            ) : (
              <svg className="h-8 w-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            )}
          </div>
          <div>
            <h1 className="mb-1 text-3xl font-bold text-zinc-900 dark:text-white">
              {member.name}
            </h1>
            <p className="mb-1 text-lg text-zinc-500">{member.title}</p>
            <p className="text-sm text-zinc-400">
              {member.collegeName} · {member.departmentName}
            </p>
          </div>
        </div>

        {/* Teaching Rating */}
        {ratingStats.reviewCount > 0 && (
          <div className="mb-6 flex items-center gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{ratingStats.avgRating.toFixed(1)}</div>
              <div className="flex items-center gap-0.5 justify-center">
                {Array.from({ length: Math.round(ratingStats.avgRating) }).map((_, i) => (
                  <svg key={i} className="h-3 w-3 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
            </div>
            <div className="text-sm text-zinc-500">
              {ratingStats.reviewCount} {ratingStats.reviewCount === 1 ? t("reviewCount") : t("reviewsPlural")}
            </div>
          </div>
        )}

        {member.bio && (
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
              {t("bio")}
            </h2>
            <p className="text-zinc-600 leading-relaxed dark:text-zinc-400">{member.bio}</p>
          </section>
        )}

        {/* Office Hours */}
        {hours.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
              {t("officeHours")}
            </h2>
            <div className="space-y-2">
              {hours.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-sm font-medium text-zinc-900 dark:text-white">
                      {h.dayName}
                    </span>
                    <span className="text-sm text-zinc-500">
                      {h.startTime} — {h.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${h.isVirtual ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                      {h.isVirtual ? t("virtual") : h.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
