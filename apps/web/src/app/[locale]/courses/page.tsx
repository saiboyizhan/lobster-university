import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listCourses } from "@/server/services/courses";
import { listColleges } from "@/server/services/colleges";
import CourseExplorer from "@/components/courses/CourseExplorer";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("courses");
  return { title: t("title"), description: t("description") };
}

export default async function CourseCatalogPage() {
  const t = await getTranslations("courses");

  let courseList: Awaited<ReturnType<typeof listCourses>> = [];
  let collegeList: Awaited<ReturnType<typeof listColleges>> = [];

  try {
    [courseList, collegeList] = await Promise.all([
      listCourses(),
      listColleges(),
    ]);
  } catch {
    // DB not seeded
  }

  const totalCredits = courseList.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mb-2 text-lg text-zinc-500">{t("description")}</p>
        <div className="mb-8 flex items-center gap-3">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {courseList.length} {t("coursesCount")}
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {totalCredits} {t("totalCredits")}
          </span>
        </div>

        <CourseExplorer
          courses={courseList}
          colleges={collegeList.map((c) => ({ slug: c.slug, name: c.name, iconEmoji: c.iconEmoji }))}
        />
      </div>
    </div>
  );
}
