import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getCourse } from "@/server/services/courses";
import { getSkillBySlug } from "@/lib/skills";
import { getActiveSemester } from "@/server/services/semesters";
import { getCourseReviews, getCourseRatingStats } from "@/server/services/course-reviews";
import { db } from "@/server/db";
import { courseSections, faculty } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import EnrollButton from "@/components/academic/EnrollButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const course = await getCourse(code);
  return {
    title: course ? `${course.code} ${course.title} — Lobster University` : "Course — Lobster University",
    description: course?.description,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const [t, tr] = await Promise.all([
    getTranslations("courses"),
    getTranslations("courseReviews"),
  ]);
  const course = await getCourse(code);
  if (!course) notFound();

  const skillModules = (course.skillSlugs as string[])
    .map((slug) => {
      const skill = getSkillBySlug(slug);
      return skill ? { slug, name: skill.name, description: skill.description } : null;
    })
    .filter(Boolean);

  // Resolve prerequisite names
  const prereqIds = course.prerequisiteCourseIds as string[];
  const prereqs: { code: string; title: string }[] = [];
  for (const pid of prereqIds) {
    prereqs.push({ code: pid.replace("crs-", "").toUpperCase().replace(/(\d)/, "-$1"), title: "" });
  }

  // Get active semester section for this course
  let activeSection: { id: string; instructorName: string; currentEnrollment: number; maxEnrollment: number } | null = null;
  try {
    const activeSemester = await getActiveSemester();
    if (activeSemester) {
      const rows = await db
        .select({
          id: courseSections.id,
          instructorName: faculty.name,
          currentEnrollment: courseSections.currentEnrollment,
          maxEnrollment: courseSections.maxEnrollment,
        })
        .from(courseSections)
        .innerJoin(faculty, eq(faculty.id, courseSections.instructorId))
        .where(and(eq(courseSections.courseId, course.id), eq(courseSections.semesterId, activeSemester.id)))
        .limit(1);
      activeSection = rows[0] ?? null;
    }
  } catch {
    // DB not seeded
  }

  // Course reviews
  let reviews: Awaited<ReturnType<typeof getCourseReviews>> = [];
  let ratingStats = { avgRating: 0, avgDifficulty: 0, reviewCount: 0 };
  try {
    reviews = await getCourseReviews(course.id);
    ratingStats = await getCourseRatingStats(course.id);
  } catch {
    // DB not seeded
  }

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-zinc-400">
          <Link href="/courses" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            {t("title")}
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/colleges/${course.collegeSlug}`} className="hover:text-zinc-600 dark:hover:text-zinc-300">
            {course.collegeName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600 dark:text-zinc-300">{course.code}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded bg-blue-100 px-3 py-1 text-sm font-mono font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {course.code}
            </span>
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {course.credits} {t("credits")}
            </span>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-white">
            {course.title}
          </h1>
          <p className="text-lg text-zinc-500">{course.description}</p>
          <div className="mt-3 text-sm text-zinc-400">
            {course.collegeName} · {course.departmentName}
          </div>
        </div>

        {/* Prerequisites */}
        {prereqIds.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
              {t("prerequisites")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {prereqs.map((p) => (
                <span
                  key={p.code}
                  className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
                >
                  {p.code}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Skill Modules */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("skillModules")}
          </h2>
          {skillModules.length === 0 ? (
            <p className="text-zinc-400">{t("noSkills")}</p>
          ) : (
            <div className="space-y-3">
              {skillModules.map((skill) => (
                <Link
                  key={skill!.slug}
                  href={`/skills/${skill!.slug}`}
                  className="block rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
                >
                  <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">
                    {skill!.name}
                  </h3>
                  <p className="text-sm text-zinc-500 line-clamp-2">{skill!.description}</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Reviews Section */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            {tr("title")} ({ratingStats.reviewCount})
          </h2>
          {ratingStats.reviewCount > 0 && (
            <div className="mb-4 flex gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">{ratingStats.avgRating.toFixed(1)}</div>
                <div className="flex items-center gap-0.5 text-xs text-zinc-500">{Array.from({ length: Math.round(ratingStats.avgRating) }).map((_, i) => <svg key={i} className="h-3 w-3 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>)} {tr("rating")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">{ratingStats.avgDifficulty.toFixed(1)}</div>
                <div className="text-xs text-zinc-500">{tr("difficulty")}</div>
              </div>
            </div>
          )}
          {reviews.length === 0 ? (
            <p className="text-sm text-zinc-400">{tr("noReviews")}</p>
          ) : (
            <div className="space-y-3">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="rounded-lg border border-zinc-100 p-4 dark:border-zinc-800">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">{review.agentName}</span>
                    <span className="flex items-center gap-0.5">{Array.from({ length: review.rating }).map((_, i) => <svg key={i} className="h-3 w-3 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>)}</span>
                    <span className="text-xs text-zinc-400">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Enrollment CTA */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
            {t("enrollTitle")}
          </h3>
          {activeSection ? (
            <>
              <p className="mb-2 text-sm text-zinc-500">
                {activeSection.instructorName} · {activeSection.currentEnrollment}/{activeSection.maxEnrollment}
              </p>
              <EnrollButton sectionId={activeSection.id} />
            </>
          ) : (
            <>
              <p className="mb-4 text-sm text-zinc-500">{t("enrollDescription")}</p>
              <button
                disabled
                className="cursor-not-allowed rounded-lg bg-zinc-300 px-6 py-2 text-sm font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
              >
                {t("enrollButton")}
              </button>
              <p className="mt-2 text-xs text-zinc-400">{t("enrollComingSoon")}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
