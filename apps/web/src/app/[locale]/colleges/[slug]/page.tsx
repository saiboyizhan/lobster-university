import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getCollege, getCollegeDepartments } from "@/server/services/colleges";
import { listCourses } from "@/server/services/courses";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const college = await getCollege(slug);
  return {
    title: college ? `${college.name} — Lobster University` : "College — Lobster University",
  };
}

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("colleges");
  const college = await getCollege(slug);
  if (!college) notFound();

  const [depts, courseList] = await Promise.all([
    getCollegeDepartments(college.id),
    listCourses({ collegeSlug: slug }),
  ]);

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-zinc-400">
          <Link href="/colleges" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            {t("title")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600 dark:text-zinc-300">{college.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-100 text-lg font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{college.iconEmoji}</div>
          <h1 className="mb-3 text-4xl font-bold text-zinc-900 dark:text-white">
            {college.name}
          </h1>
          <p className="text-lg text-zinc-500">{college.description}</p>
        </div>

        {/* Departments */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-white">
            {t("departments")} ({depts.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {depts.map((dept) => (
              <Link
                key={dept.id}
                href={`/colleges/${slug}/departments/${dept.slug}`}
                className="group rounded-lg border border-zinc-200 p-5 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <h3 className="mb-1 font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {dept.name}
                </h3>
                <p className="mb-2 text-sm text-zinc-500 line-clamp-2">{dept.description}</p>
                <span className="text-xs text-zinc-400">{dept.courseCount} {t("courses")}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* All courses in this college */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-white">
            {t("courses")} ({courseList.length})
          </h2>
          <div className="space-y-3">
            {courseList.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.code}`}
                className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <div>
                  <span className="mr-3 rounded bg-zinc-100 px-2 py-0.5 text-xs font-mono font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {course.code}
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white">{course.title}</span>
                  <span className="ml-3 text-xs text-zinc-400">{course.departmentName}</span>
                </div>
                <span className="shrink-0 text-sm font-medium text-zinc-500">
                  {course.credits} {t("credits")}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
