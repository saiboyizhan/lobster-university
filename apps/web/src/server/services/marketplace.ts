import { eq, desc, sql, and } from "drizzle-orm";
import { db } from "../db";
import { agents, listings, purchases, ratings, karmaBreakdown } from "../db/schema";

export async function listListings() {
  const rows = await db
    .select({
      id: listings.id,
      skillSlug: listings.skillSlug,
      skillName: listings.skillName,
      sellerId: listings.sellerId,
      sellerName: listings.sellerName,
      price: listings.price,
      description: listings.description,
      sales: listings.sales,
      createdAt: listings.createdAt,
      avgRating: sql<number>`coalesce(avg(${ratings.score}), 0)`,
      ratingCount: sql<number>`count(${ratings.score})`,
    })
    .from(listings)
    .leftJoin(ratings, eq(ratings.listingId, listings.id))
    .groupBy(listings.id)
    .orderBy(desc(listings.createdAt));

  return rows;
}

export async function getListing(id: string) {
  const rows = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
  const l = rows[0];
  if (!l) return null;

  const ratingRows = await db.select().from(ratings).where(eq(ratings.listingId, id));
  const avgRating =
    ratingRows.length > 0
      ? ratingRows.reduce((s, r) => s + r.score, 0) / ratingRows.length
      : 0;

  return {
    ...l,
    ratings: ratingRows,
    avgRating,
    ratingCount: ratingRows.length,
  };
}

export async function createListing(data: {
  id: string;
  skillSlug: string;
  skillName: string;
  sellerId: string;
  sellerName: string;
  price: number;
  description: string;
}) {
  await db.insert(listings).values({
    id: data.id,
    skillSlug: data.skillSlug,
    skillName: data.skillName,
    sellerId: data.sellerId,
    sellerName: data.sellerName,
    price: data.price,
    description: data.description,
    sales: 0,
    createdAt: new Date(),
  });
}

export async function buySkill(listingId: string, buyerId: string) {
  const rows = await db.select().from(listings).where(eq(listings.id, listingId)).limit(1);
  const listing = rows[0];
  if (!listing) return { ok: false, error: "Listing not found" };

  if (listing.sellerId === buyerId) {
    return { ok: false, error: "Cannot buy your own listing" };
  }

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

  // Record purchase
  await db.insert(purchases).values({
    id: crypto.randomUUID(),
    listingId,
    buyerId,
    price: listing.price,
    createdAt: new Date(),
  });

  // Increment sales count
  await db
    .update(listings)
    .set({ sales: sql`${listings.sales} + 1` })
    .where(eq(listings.id, listingId));

  return { ok: true };
}

export async function rateListing(listingId: string, buyerId: string, score: number, comment: string) {
  if (score < 1 || score > 5) return;

  const rows = await db.select().from(listings).where(eq(listings.id, listingId)).limit(1);
  if (!rows[0]) return;

  // Upsert: delete old rating then insert new one
  await db
    .delete(ratings)
    .where(and(eq(ratings.listingId, listingId), eq(ratings.buyerId, buyerId)));

  await db.insert(ratings).values({
    listingId,
    buyerId,
    score,
    comment,
    createdAt: new Date(),
  });
}
