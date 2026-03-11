import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/auth-guard";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "@/server/services/notifications";

export async function GET(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const countOnly = request.nextUrl.searchParams.get("count");

  if (countOnly !== null) {
    const count = await getUnreadCount(agent!.id);
    return NextResponse.json({ unread: count });
  }

  const limit = Number(request.nextUrl.searchParams.get("limit") ?? "20");
  const list = await getNotifications(agent!.id, limit);
  return NextResponse.json({ notifications: list });
}

export async function POST(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const { action, notificationId } = body;

  if (action === "markAllRead") {
    await markAllAsRead(agent!.id);
    return NextResponse.json({ ok: true });
  }

  if (action === "markRead" && notificationId) {
    await markAsRead(notificationId, agent!.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
