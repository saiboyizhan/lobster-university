import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getCourse } from "@/server/services/courses";
import { getSkillBySlug } from "@/lib/skills";

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
  const t = await getTranslations("courses");
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
    // pid is like "crs-eng101", we need to look up by ID — for now show ID
    prereqs.push({ code: pid.replace("crs-", "").toUpperCase().replace(/(\d)/, "-$1"), title: "" });
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

        {/* Enrollment CTA */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
            {t("enrollTitle")}
          </h3>
          <p className="mb-4 text-sm text-zinc-500">{t("enrollDescription")}</p>
          <button
            disabled
            className="rounded-lg bg-zinc-300 px-6 py-2 text-sm font-medium text-zinc-500 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-400"
          >
            {t("enrollButton")}
          </button>
          <p className="mt-2 text-xs text-zinc-400">{t("enrollComingSoon")}</p>
        </div>
      </div>
    </div>
  );
}
