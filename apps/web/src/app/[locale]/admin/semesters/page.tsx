import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { isAdmin } from "@/server/auth-guard";
import { listSemesters } from "@/server/services/semesters";
import SemesterBadge from "@/components/academic/SemesterBadge";

export const metadata: Metadata = { title: "Semesters — Admin" };

export default async function AdminSemestersPage() {
  const admin = await isAdmin();
  if (!admin) redirect("/auth/login");

  let semesters: Awaited<ReturnType<typeof listSemesters>> = [];
  try {
    semesters = await listSemesters();
  } catch {
    // DB not seeded
  }

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <nav className="mb-6 text-sm text-zinc-400">
          <Link href="/admin" className="hover:text-zinc-600 dark:hover:text-zinc-300">Admin</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600 dark:text-zinc-300">Semesters</span>
        </nav>

        <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-white">
          Semester Management
        </h1>

        {semesters.length === 0 ? (
          <p className="text-zinc-400">No semesters configured.</p>
        ) : (
          <div className="space-y-4">
            {semesters.map((sem) => (
              <div
                key={sem.id}
                className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
              >
                <div className="mb-3 flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    {sem.name}
                  </h2>
                  <SemesterBadge name={sem.isActive ? "Active" : "Upcoming"} isActive={sem.isActive} />
                </div>
                <div className="grid gap-4 text-sm text-zinc-500 sm:grid-cols-2">
                  <div>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">Semester: </span>
                    {sem.startDate.toLocaleDateString()} — {sem.endDate.toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">Enrollment: </span>
                    {sem.enrollmentOpenDate.toLocaleDateString()} — {sem.enrollmentCloseDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
