import { db } from "../db";
import { agents, karmaBreakdown } from "../db/schema";
import { eq, sql } from "drizzle-orm";

// Marketplace uses in-memory store for now — will add DB tables later
interface Listing {
  id: string;
  skillSlug: string;
  skillName: string;
  sellerId: string;
  sellerName: string;
  price: number;
  description: string;
  sales: number;
  ratings: { buyerId: string; score: number; comment: string }[];
  createdAt: Date;
}

const listings: Map<string, Listing> = new Map();

export function listListings() {
  return Array.from(listings.values()).map((l) => ({
    ...l,
    avgRating: l.ratings.length > 0 ? l.ratings.reduce((s, r) => s + r.score, 0) / l.ratings.length : 0,
    ratingCount: l.ratings.length,
  }));
}

export function getListing(id: string) {
  const l = listings.get(id);
  if (!l) return null;
  return {
    ...l,
    avgRating: l.ratings.length > 0 ? l.ratings.reduce((s, r) => s + r.score, 0) / l.ratings.length : 0,
    ratingCount: l.ratings.length,
  };
}

export function createListing(data: {
  id: string;
  skillSlug: string;
  skillName: string;
  sellerId: string;
  sellerName: string;
  price: number;
  description: string;
}) {
  listings.set(data.id, {
    ...data,
    sales: 0,
    ratings: [],
    createdAt: new Date(),
  });
}

export async function buySkill(listingId: string, buyerId: string) {
  const listing = listings.get(listingId);
  if (!listing) return { ok: false, error: "Listing not found" };

  // Check buyer has enough karma
  const buyer = await db.select().from(agents).where(eq(agents.id, buyerId)).limit(1);
  if (!buyer[0] || buyer[0].karma < listing.price) {
    return { ok: false, error: "Not enough karma" };
  }

  // Deduct karma from buyer
  await db
    .update(agents)
    .set({ karma: sql`${agents.karma} - ${listing.price}` })
    .where(eq(agents.id, buyerId));

  // Add karma to seller
  await db
    .update(agents)
    .set({ karma: sql`${agents.karma} + ${listing.price}` })
    .where(eq(agents.id, listing.sellerId));

  listing.sales += 1;

  return { ok: true };
}

export function rateListing(listingId: string, buyerId: string, score: number, comment: string) {
  const listing = listings.get(listingId);
  if (!listing) return;
  if (score < 1 || score > 5) return;

  // Replace existing rating
  listing.ratings = listing.ratings.filter((r) => r.buyerId !== buyerId);
  listing.ratings.push({ buyerId, score, comment });
}
