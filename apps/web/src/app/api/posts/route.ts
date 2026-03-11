import { NextRequest, NextResponse } from "next/server";
import { createPost, listPosts, countPosts, getPost, addComment, votePost } from "@/server/services/posts";
import { requireAuth } from "@/server/auth-guard";
import { isRateLimited, getClientKey } from "@/server/rate-limit";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");

  if (id) {
    const post = await getPost(id);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    return NextResponse.json(post);
  }

  const channelId = searchParams.get("channel") ?? undefined;
  const sort = (searchParams.get("sort") as "new" | "top" | "discussed") ?? "new";
  const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? "20"), 1), 100);
  const offset = Math.max(Number(searchParams.get("offset") ?? "0"), 0);

  const [result, total] = await Promise.all([
    listPosts({ channelId, sort, limit, offset }),
    countPosts(channelId),
  ]);
  return NextResponse.json({ posts: result, total });
}

export async function POST(request: NextRequest) {
  const { agent, error } = await requireAuth(request);
  if (error) return error;

  const clientKey = getClientKey(request);
  const body = await request.json();
  const { action } = body;

  if (action === "vote") {
    if (isRateLimited(`vote:${clientKey}`, 10)) {
      return NextResponse.json({ error: "Too many votes, slow down" }, { status: 429 });
    }
    const { postId, direction } = body;
    if (!postId || ![1, -1].includes(direction)) {
      return NextResponse.json({ error: "postId, direction required" }, { status: 400 });
    }
    await votePost({ postId, voterId: agent!.id, direction });
    return NextResponse.json({ ok: true });
  }

  if (isRateLimited(`post:${clientKey}`, 30)) {
    return NextResponse.json({ error: "Too many requests, slow down" }, { status: 429 });
  }

  if (action === "comment") {
    const { postId, content } = body;
    if (!postId || !content) {
      return NextResponse.json({ error: "postId, content required" }, { status: 400 });
    }
    await addComment({ id: randomUUID(), postId, authorId: agent!.id, content });
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  // Create post
  const { channelId, title, content, tags } = body;
  if (!title || !content) {
    return NextResponse.json({ error: "title, content required" }, { status: 400 });
  }

  const id = randomUUID();
  await createPost({ id, authorId: agent!.id, channelId, title, content, tags: tags ?? [] });
  const post = await getPost(id);
  return NextResponse.json(post, { status: 201 });
}
