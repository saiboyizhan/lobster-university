import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { isAdmin } from "@/server/auth-guard";
import { db } from "@/server/db";
import { enrollments, courseSections, courses, agents, semesters, faculty } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const metadata: Metadata = { title: "Grading — Admin" };

export default async function GradingPage() {
  const admin = await isAdmin();
  if (!admin) redirect("/auth/login");
  const t = await getTranslations("adminGrading");
  const ta = await getTranslations("admin");

  const rows = await db
    .select({
      enrollmentId: enrollments.id,
      agentName: agents.name,
      courseCode: courses.code,
      courseTitle: courses.title,
      semesterName: semesters.name,
      instructorName: faculty.name,
      status: enrollments.status,
      grade: enrollments.grade,
    })
    .from(enrollments)
    .innerJoin(agents, eq(agents.id, enrollments.agentId))
    .innerJoin(courseSections, eq(courseSections.id, enrollments.courseSectionId))
    .innerJoin(courses, eq(courses.id, courseSections.courseId))
    .innerJoin(semesters, eq(semesters.id, courseSections.semesterId))
    .innerJoin(faculty, eq(faculty.id, courseSections.instructorId))
    .orderBy(semesters.name, courses.code, agents.name);

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <nav className="mb-6 text-sm text-zinc-400">
          <Link href="/admin" className="hover:text-zinc-600 dark:hover:text-zinc-300">{ta("breadcrumbAdmin")}</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600 dark:text-zinc-300">{t("title")}</span>
        </nav>

        <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-white">{t("title")}</h1>

        {rows.length === 0 ? (
          <p className="text-zinc-400">{t("empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="py-3 pr-4">{t("columnStudent")}</th>
                  <th className="py-3 pr-4">{t("columnCourse")}</th>
                  <th className="py-3 pr-4">{t("columnSemester")}</th>
                  <th className="py-3 pr-4">{t("columnInstructor")}</th>
                  <th className="py-3 pr-4">{t("columnStatus")}</th>
                  <th className="py-3 pr-4">{t("columnGrade")}</th>
                  <th className="py-3">{t("columnAction")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {rows.map((r) => (
                  <tr key={r.enrollmentId}>
                    <td className="py-3 pr-4 font-medium text-zinc-900 dark:text-white">{r.agentName}</td>
                    <td className="py-3 pr-4">
                      <span className="font-mono text-blue-600 dark:text-blue-400">{r.courseCode}</span>
                      <span className="ml-1 text-zinc-500">{r.courseTitle}</span>
                    </td>
                    <td className="py-3 pr-4 text-zinc-500">{r.semesterName}</td>
                    <td className="py-3 pr-4 text-zinc-500">{r.instructorName}</td>
                    <td className="py-3 pr-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.status === "completed" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : r.status === "enrolled" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-bold text-zinc-900 dark:text-white">
                      {r.grade ?? "—"}
                    </td>
                    <td className="py-3">
                      {r.status === "enrolled" && (
                        <GradeForm enrollmentId={r.enrollmentId} selectLabel={t("selectPlaceholder")} gradeLabel={t("gradeButton")} passLabel={t("pass")} />
                      )}
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

function GradeForm({ enrollmentId, selectLabel, gradeLabel, passLabel }: { enrollmentId: string; selectLabel: string; gradeLabel: string; passLabel: string }) {
  return (
    <form action={`/api/admin/grade`} method="POST" className="flex gap-2">
      <input type="hidden" name="enrollmentId" value={enrollmentId} />
      <select
        name="grade"
        className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
      >
        <option value="">{selectLabel}</option>
        <option value="A+">A+</option>
        <option value="A">A</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B">B</option>
        <option value="B-">B-</option>
        <option value="C+">C+</option>
        <option value="C">C</option>
        <option value="C-">C-</option>
        <option value="D">D</option>
        <option value="F">F</option>
        <option value="P">{passLabel}</option>
      </select>
      <button
        type="submit"
        className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
      >
        {gradeLabel}
      </button>
    </form>
  );
}
