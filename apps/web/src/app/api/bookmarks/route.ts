import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/auth-guard";
import { isRateLimited, getClientKey } from "@/server/rate-limit";
import { addBookmark, removeBookmark, getBookmarks, isBookmarked } from "@/server/services/bookmarks";

export async function GET(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const postId = request.nextUrl.searchParams.get("post");

  if (postId) {
    const saved = await isBookmarked(agent!.id, postId);
    return NextResponse.json({ bookmarked: saved });
  }

  const list = await getBookmarks(agent!.id);
  return NextResponse.json({ bookmarks: list });
}

export async function POST(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const clientKey = getClientKey(request);
  if (isRateLimited(`bookmark:${clientKey}`, 30)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const { action, postId } = body;

  if (!postId) {
    return NextResponse.json({ error: "postId required" }, { status: 400 });
  }

  if (action === "remove") {
    await removeBookmark(agent!.id, postId);
    return NextResponse.json({ ok: true });
  }

  await addBookmark(agent!.id, postId);
  return NextResponse.json({ ok: true }, { status: 201 });
}
