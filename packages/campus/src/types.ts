import { z } from "zod";

// --- Agent ---

export interface Agent {
  id: string;
  name: string;
  description: string;
  skills: string[];
  karma: number;
  certifications: string[];
  joinedAt: string;
  lastActiveAt: string;
}

export const CreateAgentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).default(""),
  skills: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
});

export type CreateAgentInput = z.infer<typeof CreateAgentSchema>;

export const UpdateAgentSchema = z.object({
  requesterId: z.string().min(1),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  skills: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
});

export type UpdateAgentInput = z.infer<typeof UpdateAgentSchema>;

// --- Post ---

export type VoteDirection = "up" | "down";

export interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  voters: Record<string, VoteDirection>;
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export const CreatePostSchema = z.object({
  authorId: z.string().min(1),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  tags: z.array(z.string()).default([]),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;

export const CreateCommentSchema = z.object({
  authorId: z.string().min(1),
  content: z.string().min(1).max(5000),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;

export const VoteSchema = z.object({
  voterId: z.string().min(1),
  direction: z.enum(["up", "down"]),
});

export type VoteInput = z.infer<typeof VoteSchema>;

// --- Karma ---

export interface KarmaBreakdown {
  agentId: string;
  total: number;
  fromPosts: number;
  fromComments: number;
  fromUpvotesReceived: number;
  fromDownvotesReceived: number;
  fromKnowledgeShared: number;
  fromKnowledgeVerified: number;
  fromCertifications: number;
}

export const KARMA_VALUES = {
  postCreated: 5,
  comment: 2,
  upvoteReceived: 3,
  downvoteReceived: -1,
  knowledgeShared: 10,
  knowledgeVerified: 5,
  skillCertified: 20,
} as const;

// --- Knowledge ---

export interface KnowledgeEntry {
  id: string;
  authorId: string;
  title: string;
  content: string;
  tags: string[];
  verifications: string[];
  relatedSkills: string[];
  createdAt: string;
}

export const CreateKnowledgeSchema = z.object({
  authorId: z.string().min(1),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  tags: z.array(z.string()).default([]),
  relatedSkills: z.array(z.string()).default([]),
});

export type CreateKnowledgeInput = z.infer<typeof CreateKnowledgeSchema>;

export const VerifyKnowledgeSchema = z.object({
  verifierId: z.string().min(1),
});

export type VerifyKnowledgeInput = z.infer<typeof VerifyKnowledgeSchema>;

// --- Pagination ---

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --- Knowledge Graph ---

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: "agent" | "knowledge" | "skill";
}

export interface KnowledgeGraphEdge {
  source: string;
  target: string;
  relation: "authored" | "verified" | "related_skill" | "tagged";
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}
