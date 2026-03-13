import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCertificate } from "@/server/services/certificates";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const cert = await getCertificate(id);
  return {
    title: cert ? `Verify: ${cert.title}` : "Certificate Verification",
    description: cert ? `Verify certificate: ${cert.title} issued by Lobster University` : undefined,
  };
}

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("verifyPage");
  const cert = await getCertificate(id);
  if (!cert) notFound();

  const typeIcon = cert.type === "degree"
    ? <svg className="mx-auto h-12 w-12 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 0 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a23.838 23.838 0 0 0-1.012 5.434c0 .03.005.06.01.09a49.39 49.39 0 0 1 8.744 4.033 49.393 49.393 0 0 1 8.745-4.032c.004-.031.01-.062.01-.091a23.836 23.836 0 0 0-1.012-5.434m-15.485 0A23.94 23.94 0 0 1 12 3.197a23.94 23.94 0 0 1 7.74 6.95M12 3.197V1.5m0 1.697a23.94 23.94 0 0 0-7.74 6.95" /></svg>
    : cert.type === "honor"
      ? <svg className="mx-auto h-12 w-12 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.77.896m5.25-6.86V2.721" /></svg>
      : <svg className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>;
  const typeLabel =
    cert.type === "course_completion"
      ? t("courseCompletion")
      : cert.type === "degree"
        ? t("degree")
        : t("honor");

  const isOnChain = !!cert.txHash;

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl px-6 py-12">
        {/* Verification Status */}
        <div className={`mb-6 rounded-xl p-4 text-center ${
          isOnChain
            ? "bg-green-50 dark:bg-green-950"
            : "bg-amber-50 dark:bg-amber-950"
        }`}>
          <div className="mb-1 text-lg font-semibold">
            {isOnChain ? (
              <span className="text-green-700 dark:text-green-300">{t("verifiedOnChain")}</span>
            ) : (
              <span className="text-amber-700 dark:text-amber-300">{t("offChain")}</span>
            )}
          </div>
          <p className="text-sm text-zinc-500">
            {isOnChain ? t("verifiedDesc") : t("offChainDesc")}
          </p>
        </div>

        {/* Certificate Card */}
        <div className="rounded-2xl border-2 border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-8 text-center shadow-lg dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-950">
          <div className="mb-2">{typeIcon}</div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
            {typeLabel}
          </p>
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {cert.title}
          </h1>
          <p className="mb-4 text-zinc-500">{cert.description}</p>

          <div className="mb-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
            {cert.grade && (
              <div className="mb-2">
                <span className="text-sm text-zinc-400">{t("grade")}: </span>
                <span className="font-bold text-zinc-900 dark:text-white">{cert.grade}</span>
              </div>
            )}
            {cert.courseCode && (
              <div className="mb-2">
                <span className="text-sm text-zinc-400">{t("course")}: </span>
                <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                  {cert.courseCode}
                </span>
              </div>
            )}
            {cert.collegeName && (
              <div className="mb-2">
                <span className="text-sm text-zinc-400">{t("college")}: </span>
                <span className="text-zinc-700 dark:text-zinc-300">{cert.collegeName}</span>
              </div>
            )}
            <div>
              <span className="text-sm text-zinc-400">{t("issued")}: </span>
              <span className="text-zinc-700 dark:text-zinc-300">
                {cert.issuedAt.toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* On-chain proof */}
          {isOnChain && (
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
              {cert.tokenId !== null && (
                <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                  {t("tokenId")}: #{cert.tokenId}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-700">
            <p className="text-xs text-zinc-400">
              {t("universityName")} — Certificate ID: {cert.id.slice(0, 8)}
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            {t("universityName")}
          </Link>
        </div>
      </div>
    </div>
  );
}
