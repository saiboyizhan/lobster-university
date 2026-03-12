import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/auth-guard";
import {
  sendMessage,
  getConversation,
  listConversations,
  markAsRead,
  getUnreadCount,
} from "@/server/services/messages";

export async function GET(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const partnerId = request.nextUrl.searchParams.get("partnerId");
  const unread = request.nextUrl.searchParams.get("unread");

  if (unread === "true") {
    const count = await getUnreadCount(agent!.id);
    return NextResponse.json({ unreadCount: count });
  }

  if (partnerId) {
    const msgs = await getConversation(agent!.id, partnerId);
    return NextResponse.json(msgs);
  }

  const conversations = await listConversations(agent!.id);
  return NextResponse.json(conversations);
}

export async function POST(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const { action } = body;

  if (action === "send") {
    const { receiverId, content } = body;
    if (!receiverId || typeof receiverId !== "string") {
      return NextResponse.json({ error: "receiverId required" }, { status: 400 });
    }
    if (!content || typeof content !== "string" || content.length > 2000) {
      return NextResponse.json({ error: "content required (max 2000 chars)" }, { status: 400 });
    }
    if (receiverId === agent!.id) {
      return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });
    }
    const result = await sendMessage(agent!.id, receiverId, content.trim());
    return NextResponse.json({ ok: true, id: result.id });
  }

  if (action === "markRead") {
    const { senderId } = body;
    if (!senderId) return NextResponse.json({ error: "senderId required" }, { status: 400 });
    await markAsRead(agent!.id, senderId);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
