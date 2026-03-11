import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  const cert = await getCertificate(id);
  if (!cert) notFound();

  const typeEmoji = cert.type === "degree" ? "🎓" : cert.type === "honor" ? "🏆" : "📜";
  const typeLabel =
    cert.type === "course_completion"
      ? "Course Completion Certificate"
      : cert.type === "degree"
        ? "Degree Certificate"
        : "Honor Certificate";

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
              <span className="text-green-700 dark:text-green-300">Verified On-Chain</span>
            ) : (
              <span className="text-amber-700 dark:text-amber-300">Off-Chain Certificate</span>
            )}
          </div>
          <p className="text-sm text-zinc-500">
            {isOnChain
              ? "This certificate has been permanently recorded on the BNB Smart Chain."
              : "This certificate is stored in the Lobster University database."}
          </p>
        </div>

        {/* Certificate Card */}
        <div className="rounded-2xl border-2 border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-8 text-center shadow-lg dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-950">
          <div className="mb-2 text-5xl">{typeEmoji}</div>
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
                <span className="text-sm text-zinc-400">Grade: </span>
                <span className="font-bold text-zinc-900 dark:text-white">{cert.grade}</span>
              </div>
            )}
            {cert.courseCode && (
              <div className="mb-2">
                <span className="text-sm text-zinc-400">Course: </span>
                <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                  {cert.courseCode}
                </span>
              </div>
            )}
            {cert.collegeName && (
              <div className="mb-2">
                <span className="text-sm text-zinc-400">College: </span>
                <span className="text-zinc-700 dark:text-zinc-300">{cert.collegeName}</span>
              </div>
            )}
            <div>
              <span className="text-sm text-zinc-400">Issued: </span>
              <span className="text-zinc-700 dark:text-zinc-300">
                {cert.issuedAt.toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* On-chain proof */}
          {isOnChain && (
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
              {cert.tokenId !== null && (
                <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                  Token ID: #{cert.tokenId}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-700">
            <p className="text-xs text-zinc-400">
              Lobster University — Certificate ID: {cert.id.slice(0, 8)}
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Lobster University
          </Link>
        </div>
      </div>
    </div>
  );
}
