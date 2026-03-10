import { NextRequest, NextResponse } from "next/server";
import { listListings, getListing, createListing, buySkill, rateListing } from "@/server/services/marketplace";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (id) {
    const listing = getListing(id);
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    return NextResponse.json(listing);
  }

  return NextResponse.json({ listings: listListings() });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  if (action === "buy") {
    const { listingId, buyerId } = body;
    if (!listingId || !buyerId) {
      return NextResponse.json({ error: "listingId and buyerId required" }, { status: 400 });
    }
    const result = await buySkill(listingId, buyerId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  if (action === "rate") {
    const { listingId, buyerId, score, comment } = body;
    rateListing(listingId, buyerId, score, comment ?? "");
    return NextResponse.json({ ok: true });
  }

  // Create listing
  const { skillSlug, skillName, sellerId, sellerName, price, description } = body;
  if (!skillSlug || !sellerId || !price) {
    return NextResponse.json({ error: "skillSlug, sellerId, price required" }, { status: 400 });
  }

  const id = randomUUID();
  createListing({ id, skillSlug, skillName: skillName ?? skillSlug, sellerId, sellerName: sellerName ?? "", price, description: description ?? "" });
  return NextResponse.json({ id }, { status: 201 });
}
