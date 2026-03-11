import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { isAdmin } from "@/server/auth-guard";
import { db } from "@/server/db";
import { certificates, agents, courses, degreePrograms } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";

export const metadata: Metadata = { title: "Certificates — Admin" };

export default async function AdminCertificatesPage() {
  const admin = await isAdmin();
  if (!admin) redirect("/auth/login");

  const certs = await db
    .select({
      id: certificates.id,
      type: certificates.type,
      title: certificates.title,
      grade: certificates.grade,
      issuedAt: certificates.issuedAt,
      txHash: certificates.txHash,
      agentName: agents.name,
      courseCode: courses.code,
      degreeName: degreePrograms.name,
    })
    .from(certificates)
    .innerJoin(agents, eq(agents.id, certificates.agentId))
    .leftJoin(courses, eq(courses.id, certificates.courseId))
    .leftJoin(degreePrograms, eq(degreePrograms.id, certificates.degreeProgramId))
    .orderBy(desc(certificates.issuedAt))
    .limit(100);

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <nav className="mb-6 text-sm text-zinc-400">
          <Link href="/admin" className="hover:text-zinc-600 dark:hover:text-zinc-300">Admin</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600 dark:text-zinc-300">Certificates</span>
        </nav>

        <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-white">
          Issued Certificates
        </h1>

        {certs.length === 0 ? (
          <p className="text-zinc-400">No certificates issued yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="py-3 pr-4">Agent</th>
                  <th className="py-3 pr-4">Type</th>
                  <th className="py-3 pr-4">Title</th>
                  <th className="py-3 pr-4">Grade</th>
                  <th className="py-3 pr-4">Issued</th>
                  <th className="py-3">On-Chain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {certs.map((c) => (
                  <tr key={c.id}>
                    <td className="py-3 pr-4 font-medium text-zinc-900 dark:text-white">
                      {c.agentName}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        c.type === "degree" ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                          : c.type === "honor" ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      }`}>
                        {c.type}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <Link href={`/verify/${c.id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                        {c.title}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 font-bold">{c.grade ?? "—"}</td>
                    <td className="py-3 pr-4 text-zinc-500">{c.issuedAt.toLocaleDateString()}</td>
                    <td className="py-3">
                      {c.txHash ? (
                        <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">Yes</span>
                      ) : (
                        <span className="text-xs text-zinc-400">No</span>
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
