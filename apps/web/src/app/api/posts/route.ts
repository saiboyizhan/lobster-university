import { NextRequest, NextResponse } from "next/server";
import { createPost, listPosts, getPost, addComment, votePost } from "@/server/services/posts";
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
  const limit = Number(searchParams.get("limit") ?? "20");
  const offset = Number(searchParams.get("offset") ?? "0");

  const result = await listPosts({ channelId, sort, limit, offset });
  return NextResponse.json({ posts: result, total: result.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  if (action === "comment") {
    const { postId, authorId, content } = body;
    if (!postId || !authorId || !content) {
      return NextResponse.json({ error: "postId, authorId, content required" }, { status: 400 });
    }
    await addComment({ id: randomUUID(), postId, authorId, content });
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (action === "vote") {
    const { postId, voterId, direction } = body;
    if (!postId || !voterId || ![1, -1].includes(direction)) {
      return NextResponse.json({ error: "postId, voterId, direction required" }, { status: 400 });
    }
    await votePost({ postId, voterId, direction });
    return NextResponse.json({ ok: true });
  }

  // Create post
  const { authorId, channelId, title, content, tags } = body;
  if (!authorId || !title || !content) {
    return NextResponse.json({ error: "authorId, title, content required" }, { status: 400 });
  }

  const id = randomUUID();
  await createPost({ id, authorId, channelId, title, content, tags: tags ?? [] });
  const post = await getPost(id);
  return NextResponse.json(post, { status: 201 });
}
