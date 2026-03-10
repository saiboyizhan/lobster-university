import fs from "fs";
import path from "path";

export interface Playbook {
  id: string;
  title: string;
  desc: string;
  time: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  skills: string[];
  category: "general" | "crypto";
}

const PLAYBOOKS: Playbook[] = [
  { id: "ai-skill-learning", title: "AI Skill Learning: From Zero to Real Output", desc: "Learn any AI skill through structured practice with agent-guided feedback loops.", time: "20 min", level: "Beginner", skills: ["google-search", "summarizer", "assessment"], category: "general" },
  { id: "career-learning-loop", title: "Career Learning Loop", desc: "Build a continuous professional development cycle with AI-assisted skill gap analysis.", time: "25 min", level: "Intermediate", skills: ["assessment", "mental-models", "selfoptimize"], category: "general" },
  { id: "english-learning-professionals", title: "English for Professionals", desc: "Improve business English through immersive practice with real-time feedback.", time: "15 min", level: "Beginner", skills: ["translator", "rewriter", "content-engine"], category: "general" },
  { id: "exam-prep-fast-track", title: "Exam Prep Fast Track", desc: "Ace any exam with spaced repetition, practice tests, and targeted weakness analysis.", time: "30 min", level: "Intermediate", skills: ["assessment", "summarizer", "keyword-extractor"], category: "general" },
  { id: "learning-science-system", title: "Learning Science System", desc: "Apply evidence-based learning techniques with AI coaching and progress tracking.", time: "20 min", level: "Advanced", skills: ["mental-models", "assessment", "healthcheck"], category: "general" },
  { id: "micro-learning-daily-digest", title: "Micro-Learning Daily Digest", desc: "Learn in 5-minute daily sessions with curated content and spaced repetition.", time: "10 min", level: "Beginner", skills: ["rss-manager", "summarizer", "reminder"], category: "general" },
  { id: "personal-knowledge-system", title: "Personal Knowledge System", desc: "Build a second brain with AI-assisted capture, organization, and retrieval.", time: "25 min", level: "Intermediate", skills: ["keyword-extractor", "summarizer", "google-search"], category: "general" },
  { id: "research-paper-reading", title: "Research Paper Reading", desc: "Read and synthesize academic papers efficiently with structured analysis workflows.", time: "20 min", level: "Intermediate", skills: ["academic-search", "summarizer", "keyword-extractor"], category: "general" },
  { id: "technical-interview-training", title: "Technical Interview Training", desc: "Prepare for coding interviews with systematic practice and AI mock interviews.", time: "30 min", level: "Advanced", skills: ["code-gen", "debugger", "mental-models"], category: "general" },
  { id: "writing-for-impact", title: "Writing for Impact", desc: "Master persuasive writing through structured frameworks and iterative AI feedback.", time: "20 min", level: "Intermediate", skills: ["writer", "copywriter", "rewriter"], category: "general" },
  { id: "crypto-trading-fundamentals", title: "Crypto Trading Fundamentals", desc: "Master on-chain analysis, DEX trading, and risk management with your AI agent.", time: "30 min", level: "Intermediate", skills: ["chain-analyzer", "dex-trader", "wallet-monitor"], category: "crypto" },
  { id: "whale-tracking", title: "Whale Tracking: Follow Smart Money On-Chain", desc: "Identify whale wallets, track fund flows, and interpret on-chain signals.", time: "25 min", level: "Advanced", skills: ["chain-analyzer", "wallet-monitor", "mental-models"], category: "crypto" },
  { id: "token-launch-guide", title: "Token Launch Guide: From Contract to Community", desc: "Design tokenomics, deploy contracts, bootstrap liquidity, and build community.", time: "40 min", level: "Advanced", skills: ["token-launcher", "kol-manager", "content-engine"], category: "crypto" },
  { id: "crypto-kol-operations", title: "Crypto KOL Operations: Build Influence in Web3", desc: "Build and operate a crypto KOL presence with AI-assisted content and engagement.", time: "25 min", level: "Intermediate", skills: ["kol-manager", "twitter-intel", "social-media"], category: "crypto" },
  { id: "defi-risk-management", title: "DeFi Risk Management: Protect Your Portfolio", desc: "Detect rug pulls, manage impermanent loss, and size positions with AI assistance.", time: "20 min", level: "Intermediate", skills: ["dex-trader", "wallet-monitor", "chain-analyzer"], category: "crypto" },
];

const PLAYBOOKS_DIR = path.resolve(process.cwd(), "../../playbooks");

export function getAllPlaybooks(): Playbook[] {
  return PLAYBOOKS;
}

export function getPlaybookById(id: string): Playbook | undefined {
  return PLAYBOOKS.find((p) => p.id === id);
}

export function filterPlaybooks(opts: {
  category?: string;
  level?: string;
}): Playbook[] {
  let results: Playbook[] = PLAYBOOKS;
  if (opts.category) {
    results = results.filter((p) => p.category === opts.category);
  }
  if (opts.level) {
    results = results.filter((p) => p.level === opts.level);
  }
  return results;
}

export function getPlaybookContent(id: string, locale: string): string | null {
  const filePath = path.join(PLAYBOOKS_DIR, locale, `playbook-${id}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}
