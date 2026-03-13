import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("certificateDetail");
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
            {t("breadcrumb")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600 dark:text-zinc-300">{cert.title}</span>
        </nav>

        {/* Certificate Card */}
        <div className="rounded-2xl border-2 border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-8 text-center shadow-lg dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-950">
          <div className="mb-4 flex justify-center">
            {cert.type === "degree" ? (
              <svg className="h-12 w-12 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            ) : cert.type === "honor" ? (
              <svg className="h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.77.896m5.25-6.86V2.721" />
              </svg>
            ) : (
              <svg className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
            )}
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
              <span className="text-sm text-zinc-400">{t("grade")}: </span>
              <span className="font-bold text-zinc-900 dark:text-white">{cert.grade}</span>
            </div>
          )}

          {cert.collegeName && (
            <p className="mb-2 text-sm text-zinc-400">{cert.collegeName}</p>
          )}

          <p className="mb-4 text-sm text-zinc-400">
            {t("issued")}: {cert.issuedAt.toLocaleDateString()}
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
                {t("txHash")}
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
            {t("shareLink")}
          </Link>
        </div>
      </div>
    </div>
  );
}
