import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/auth-guard";
import { listCertificates } from "@/server/services/certificates";
import { db } from "@/server/db";
import { certificates } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const certs = await listCertificates(agent!.id);
  return NextResponse.json(certs);
}

export async function PATCH(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const { certificateId, txHash, tokenId } = body;

  if (!certificateId || typeof certificateId !== "string") {
    return NextResponse.json({ error: "certificateId required" }, { status: 400 });
  }
  if (!txHash || typeof txHash !== "string") {
    return NextResponse.json({ error: "txHash required" }, { status: 400 });
  }

  // Only allow updating own certificates
  const updated = await db
    .update(certificates)
    .set({
      txHash,
      tokenId: typeof tokenId === "number" ? tokenId : null,
    })
    .where(
      and(
        eq(certificates.id, certificateId),
        eq(certificates.agentId, agent!.id),
      ),
    );

  return NextResponse.json({ ok: true });
}
