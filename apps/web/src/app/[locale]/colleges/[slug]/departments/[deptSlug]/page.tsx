import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getCollege, getDepartment } from "@/server/services/colleges";
import { getCoursesByDepartment } from "@/server/services/courses";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; deptSlug: string }>;
}): Promise<Metadata> {
  const { deptSlug } = await params;
  const dept = await getDepartment(deptSlug);
  return {
    title: dept ? `${dept.name} — Lobster University` : "Department — Lobster University",
  };
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string; deptSlug: string }>;
}) {
  const { slug, deptSlug } = await params;
  const t = await getTranslations("colleges");

  const [college, dept] = await Promise.all([
    getCollege(slug),
    getDepartment(deptSlug),
  ]);
  if (!college || !dept || dept.collegeId !== college.id) notFound();

  const courseList = await getCoursesByDepartment(dept.id);

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-zinc-400">
          <Link href="/colleges" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            {t("title")}
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/colleges/${slug}`} className="hover:text-zinc-600 dark:hover:text-zinc-300">
            {college.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600 dark:text-zinc-300">{dept.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-white">
            {dept.name}
          </h1>
          <p className="text-lg text-zinc-500">{dept.description}</p>
          <p className="mt-2 text-sm text-zinc-400">
            {college.iconEmoji} {college.name}
          </p>
        </div>

        {/* Courses */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-white">
            {t("courses")} ({courseList.length})
          </h2>
          {courseList.length === 0 ? (
            <p className="text-zinc-400">{t("noCourses")}</p>
          ) : (
            <div className="space-y-4">
              {courseList.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.code}`}
                  className="block rounded-lg border border-zinc-200 p-5 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-mono font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {course.code}
                    </span>
                    <span className="text-sm font-medium text-zinc-500">
                      {course.credits} {t("credits")}
                    </span>
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-white">
                    {course.title}
                  </h3>
                  <p className="text-sm text-zinc-500 line-clamp-2">{course.description}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
