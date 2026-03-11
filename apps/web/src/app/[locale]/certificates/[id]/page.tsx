import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getCertificate } from "@/server/services/certificates";
import MintCertificateButton from "@/components/academic/MintCertificateButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const cert = await getCertificate(id);
  return {
    title: cert ? `${cert.title} — Certificate` : "Certificate — Lobster University",
  };
}

export default async function CertificateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cert = await getCertificate(id);
  if (!cert) notFound();

  const typeLabel =
    cert.type === "course_completion"
      ? "Course Completion"
      : cert.type === "degree"
        ? "Degree"
        : "Honor";

  const typeColor =
    cert.type === "degree"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
      : cert.type === "honor"
        ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
        : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";

  const gradeToLevel = (grade: string | null): number => {
    if (!grade) return 1;
    if (grade.startsWith("A")) return 6;
    if (grade.startsWith("B")) return 4;
    if (grade.startsWith("C")) return 3;
    if (grade.startsWith("D")) return 2;
    return 1;
  };

  const gradeToScore = (grade: string | null): number => {
    if (!grade) return 5000;
    const scores: Record<string, number> = {
      "A+": 10000, "A": 9500, "A-": 9000,
      "B+": 8500, "B": 8000, "B-": 7500,
      "C+": 7000, "C": 6500, "C-": 6000,
      "D+": 5500, "D": 5000, "D-": 4500,
      "P": 7500,
    };
    return scores[grade] ?? 5000;
  };

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-zinc-400">
          <Link href="/certificates" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            Certificates
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600 dark:text-zinc-300">{cert.title}</span>
        </nav>

        {/* Certificate Card */}
        <div className="rounded-2xl border-2 border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-8 text-center shadow-lg dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-950">
          <div className="mb-4 text-5xl">
            {cert.type === "degree" ? "🎓" : cert.type === "honor" ? "🏆" : "📜"}
          </div>
          <div className="mb-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${typeColor}`}>
              {typeLabel}
            </span>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {cert.title}
          </h1>
          <p className="mb-4 text-zinc-500">{cert.description}</p>

          {cert.grade && (
            <div className="mb-4">
              <span className="text-sm text-zinc-400">Grade: </span>
              <span className="font-bold text-zinc-900 dark:text-white">{cert.grade}</span>
            </div>
          )}

          {cert.collegeName && (
            <p className="mb-2 text-sm text-zinc-400">{cert.collegeName}</p>
          )}

          <p className="mb-4 text-sm text-zinc-400">
            Issued: {cert.issuedAt.toLocaleDateString()}
          </p>

          {/* On-chain status / Mint button */}
          <div className="mb-4">
            <MintCertificateButton
              certificateId={cert.id}
              title={cert.title}
              level={gradeToLevel(cert.grade)}
              score={gradeToScore(cert.grade)}
              txHash={cert.txHash}
            />
          </div>

          {cert.txHash && (
            <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950">
              <div className="mb-1 text-xs font-medium text-green-700 dark:text-green-300">
                Transaction Hash
              </div>
              <a
                href={`https://testnet.bscscan.com/tx/${cert.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all font-mono text-xs text-green-600 underline hover:text-green-800 dark:text-green-400"
              >
                {cert.txHash}
              </a>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href={`/verify/${cert.id}`}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Shareable Verification Link
          </Link>
        </div>
      </div>
    </div>
  );
}
