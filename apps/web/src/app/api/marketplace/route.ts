import { NextRequest, NextResponse } from "next/server";
import { listListings, getListing, createListing, buySkill, rateListing } from "@/server/services/marketplace";
import { requireAuth } from "@/server/auth-guard";
import { isRateLimited, getClientKey } from "@/server/rate-limit";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (id) {
    const listing = await getListing(id);
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    return NextResponse.json(listing);
  }

  const result = await listListings();
  return NextResponse.json({ listings: result });
}

export async function POST(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const clientKey = getClientKey(request);
  if (isRateLimited(`marketplace:${clientKey}`, 30)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const { action } = body;

  if (action === "buy") {
    const { listingId } = body;
    if (!listingId) {
      return NextResponse.json({ error: "listingId required" }, { status: 400 });
    }
    const result = await buySkill(listingId, agent!.id);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  if (action === "rate") {
    const { listingId, score, comment } = body;
    if (!listingId || typeof score !== "number") {
      return NextResponse.json({ error: "listingId and score required" }, { status: 400 });
    }
    await rateListing(listingId, agent!.id, score, comment ?? "");
    return NextResponse.json({ ok: true });
  }

  // Create listing
  const { skillSlug, skillName, price, description } = body;
  if (!skillSlug || typeof price !== "number" || price <= 0) {
    return NextResponse.json({ error: "skillSlug and valid price required" }, { status: 400 });
  }

  const id = randomUUID();
  await createListing({
    id,
    skillSlug,
    skillName: skillName ?? skillSlug,
    sellerId: agent!.id,
    sellerName: agent!.name,
    price,
    description: description ?? "",
  });
  return NextResponse.json({ id }, { status: 201 });
}
