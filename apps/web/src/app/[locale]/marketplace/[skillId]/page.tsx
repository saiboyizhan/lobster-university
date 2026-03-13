import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Badge from "@/components/ui/Badge";
import { getListing } from "@/server/services/marketplace";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ skillId: string }>;
}): Promise<Metadata> {
  const { skillId } = await params;
  const listing = await getListing(skillId);
  const name = listing?.skillName ?? skillId;
  return {
    title: `${name} — Marketplace — Lobster University`,
    description: listing ? `${name} by ${listing.sellerName} — ${listing.price} KARMA` : undefined,
  };
}

export default async function MarketplaceDetailPage({
  params,
}: {
  params: Promise<{ skillId: string }>;
}) {
  const { skillId } = await params;
  const t = await getTranslations("marketplaceDetail");
  const listing = await getListing(skillId);

  if (!listing) notFound();

  const reviews = listing.ratings ?? [];
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum: number, r: { score: number }) => sum + r.score, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-zinc-500">
          <Link href="/marketplace" className="hover:text-zinc-900 dark:hover:text-white">
            {t("breadcrumbMarketplace")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-900 dark:text-white">{listing.skillName}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
              {listing.skillName}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-500">{t("byAuthor", { seller: listing.sellerName })}</span>
              <span className="text-sm text-zinc-400">{t("sales", { count: listing.sales })}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white">
              {listing.price} <span className="text-lg font-normal text-zinc-400">{t("priceUnit")}</span>
            </div>
            <button
              disabled
              className="mt-3 rounded-lg bg-zinc-900 px-8 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900"
            >
              {t("buyButton")}
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("descriptionTitle")}
          </h2>
          <pre className="whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-sm leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            {listing.description}
          </pre>
        </div>

        {/* Base skill link */}
        <div className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("baseSkillTitle")}
          </h2>
          <Link
            href={`/skills/${listing.skillSlug}`}
            className="inline-block rounded-md bg-zinc-100 px-3 py-1 text-sm text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {t("viewSkillDetails", { skillName: listing.skillName })}
          </Link>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("reviewsTitle", { count: reviews.length })}
          </h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review: { buyerId: string; score: number; comment: string }, idx: number) => (
                <div
                  key={idx}
                  className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">
                      {review.buyerId}
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg
                          key={s}
                          className={`h-3 w-3 ${s <= review.score ? "text-yellow-400" : "text-zinc-300 dark:text-zinc-600"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">{t("noReviews")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
