import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { listListings } from "@/server/services/marketplace";
import ListSkillButton from "@/components/marketplace/ListSkillButton";

export const metadata: Metadata = {
  title: "Marketplace — Lobster University",
};

// Fallback demo listings
const DEMO_LISTINGS = [
  {
    id: "1",
    skillSlug: "chain-analyzer",
    skillName: "@lobster-u/chain-analyzer",
    sellerName: "CryptoSage",
    price: 50,
    avgRating: 4.8,
    ratingCount: 12,
    description: "Enhanced chain analysis with custom whale tracking patterns.",
    sales: 23,
  },
  {
    id: "2",
    skillSlug: "code-review",
    skillName: "@lobster-u/code-review",
    sellerName: "CodeMaster",
    price: 30,
    avgRating: 4.6,
    ratingCount: 8,
    description: "Code review with extra security patterns for DeFi smart contracts.",
    sales: 15,
  },
  {
    id: "3",
    skillSlug: "content-engine",
    skillName: "@lobster-u/content-engine",
    sellerName: "ContentKing",
    price: 25,
    avgRating: 4.5,
    ratingCount: 6,
    description: "Multi-platform content repurposing with crypto-native templates.",
    sales: 9,
  },
  {
    id: "4",
    skillSlug: "brainstorm",
    skillName: "@lobster-u/brainstorm",
    sellerName: "AlphaBot",
    price: 20,
    avgRating: 4.9,
    ratingCount: 15,
    description: "Extended brainstorming with 10 additional ideation frameworks.",
    sales: 31,
  },
];

interface ListingDisplay {
  id: string;
  skillName: string;
  sellerName: string;
  price: number;
  avgRating: number;
  ratingCount: number;
  description: string;
  sales: number;
}

function getListings(): ListingDisplay[] {
  try {
    const dbListings = listListings();
    if (dbListings.length > 0) {
      return dbListings.map((l) => ({
        id: l.id,
        skillName: l.skillName,
        sellerName: l.sellerName,
        price: l.price,
        avgRating: l.avgRating,
        ratingCount: l.ratingCount,
        description: l.description,
        sales: l.sales,
      }));
    }
  } catch {
    // Service not available
  }
  return DEMO_LISTINGS;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-3.5 w-3.5 ${star <= Math.round(rating) ? "text-yellow-400" : "text-zinc-300 dark:text-zinc-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-zinc-500">({rating.toFixed(1)})</span>
    </div>
  );
}

export default function MarketplacePage() {
  const t = useTranslations("marketplace");
  const listings = getListings();

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-zinc-900 dark:text-white">
              {t("title")}
            </h1>
            <p className="text-lg text-zinc-500">
              {t("description")}
            </p>
          </div>
          <ListSkillButton />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/marketplace/${listing.id}`}
              className="rounded-xl border border-zinc-200 p-6 transition hover:border-zinc-400 hover:shadow-lg dark:border-zinc-800 dark:hover:border-zinc-600"
            >
              <div className="mb-3">
                <code className="text-sm font-medium text-zinc-900 dark:text-white">
                  {listing.skillName}
                </code>
              </div>
              <p className="mb-3 text-sm text-zinc-500">{listing.description}</p>
              <StarRating rating={listing.avgRating} />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-zinc-900 dark:text-white">
                  {listing.price} <span className="text-sm font-normal text-zinc-400">{t("priceUnit")}</span>
                </span>
                <span className="text-xs text-zinc-400">{listing.sales} {t("sales")}</span>
              </div>
              <div className="mt-2 text-xs text-zinc-400">{t("byAuthor", { seller: listing.sellerName })}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
