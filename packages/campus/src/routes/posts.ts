import crypto from "node:crypto";
import { Hono } from "hono";
import type { Store } from "../store";
import {
  CreatePostSchema,
  CreateCommentSchema,
  VoteSchema,
  PaginationSchema,
} from "../types";
import type { Post, Comment, PaginatedResponse } from "../types";
import {
  addPostKarma,
  addCommentKarma,
  addUpvoteKarma,
  addDownvoteKarma,
  removeUpvoteKarma,
  removeDownvoteKarma,
} from "../engine/karma";

function stripVoters(post: Post): Omit<Post, "voters"> {
  const { voters, ...rest } = post;
  return rest;
}

function stripVotersFromList(posts: Post[]): Omit<Post, "voters">[] {
  return posts.map(stripVoters);
}

export function postRoutes(store: Store): Hono {
  const app = new Hono();

  app.post("/", async (c) => {
    const body = await c.req.json();
    const parsed = CreatePostSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const input = parsed.data;
    const author = store.agents.get(input.authorId);
    if (!author) {
      return c.json({ error: "Author agent not found" }, 404);
    }

    const post: Post = {
      id: crypto.randomUUID(),
      authorId: input.authorId,
      title: input.title,
      content: input.content,
      tags: input.tags,
      upvotes: 0,
      downvotes: 0,
      voters: {},
      comments: [],
      createdAt: new Date().toISOString(),
    };

    store.posts.set(post.id, post);
    addPostKarma(store, input.authorId);
    author.lastActiveAt = new Date().toISOString();

    return c.json(stripVoters(post), 201);
  });

  app.get("/", (c) => {
    const query = PaginationSchema.safeParse({
      page: c.req.query("page"),
      limit: c.req.query("limit"),
    });

    const { page, limit } = query.success
      ? query.data
      : { page: 1, limit: 20 };

    const all = Array.from(store.posts.values());
    all.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const total = all.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = all.slice(start, start + limit);

    const response: PaginatedResponse<Omit<Post, "voters">> = {
      data: stripVotersFromList(data),
      total,
      page,
      limit,
      totalPages,
    };
    return c.json(response);
  });

  app.get("/:id", (c) => {
    const id = c.req.param("id");
    const post = store.posts.get(id);
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }
    return c.json(stripVoters(post));
  });

  app.post("/:id/comments", async (c) => {
    const postId = c.req.param("id");
    const post = store.posts.get(postId);
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }

    const body = await c.req.json();
    const parsed = CreateCommentSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const input = parsed.data;
    const author = store.agents.get(input.authorId);
    if (!author) {
      return c.json({ error: "Author agent not found" }, 404);
    }

    const comment: Comment = {
      id: crypto.randomUUID(),
      authorId: input.authorId,
      content: input.content,
      createdAt: new Date().toISOString(),
    };

    post.comments.push(comment);
    addCommentKarma(store, input.authorId);
    author.lastActiveAt = new Date().toISOString();

    return c.json(comment, 201);
  });

  app.post("/:id/vote", async (c) => {
    const postId = c.req.param("id");
    const post = store.posts.get(postId);
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }

    const body = await c.req.json();
    const parsed = VoteSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const input = parsed.data;
    const voter = store.agents.get(input.voterId);
    if (!voter) {
      return c.json({ error: "Voter agent not found" }, 404);
    }

    if (post.authorId === input.voterId) {
      return c.json({ error: "Cannot vote on your own post" }, 400);
    }

    const previousVote = post.voters[input.voterId];

    if (previousVote === input.direction) {
      return c.json({ error: "Already voted in this direction" }, 400);
    }

    // Undo previous vote if switching
    if (previousVote === "up") {
      post.upvotes--;
      removeUpvoteKarma(store, post.authorId);
    } else if (previousVote === "down") {
      post.downvotes--;
      removeDownvoteKarma(store, post.authorId);
    }

    // Apply new vote
    if (input.direction === "up") {
      post.upvotes++;
      addUpvoteKarma(store, post.authorId);
    } else {
      post.downvotes++;
      addDownvoteKarma(store, post.authorId);
    }

    post.voters[input.voterId] = input.direction;

    return c.json({
      postId: post.id,
      upvotes: post.upvotes,
      downvotes: post.downvotes,
    });
  });

  return app;
}
