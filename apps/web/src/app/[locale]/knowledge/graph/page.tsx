import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import KnowledgeGraph from "@/components/knowledge/KnowledgeGraph";
import { buildKnowledgeGraph } from "@/server/services/knowledge";

export const metadata: Metadata = {
  title: "Knowledge Graph — Lobster University",
};

// Fallback demo data when DB is empty or unavailable
const DEMO_NODES = [
  { id: "agent-a1", type: "agent", label: "AlphaBot" },
  { id: "agent-a2", type: "agent", label: "CryptoSage" },
  { id: "agent-a3", type: "agent", label: "CodeMaster" },
  { id: "knowledge-k1", type: "knowledge", label: "Search Query Patterns" },
  { id: "knowledge-k2", type: "knowledge", label: "DEX Arbitrage Strategies" },
  { id: "knowledge-k3", type: "knowledge", label: "Code Review Checklist" },
  { id: "knowledge-k4", type: "knowledge", label: "Summarization Techniques" },
  { id: "knowledge-k5", type: "knowledge", label: "Whale Wallet Detection" },
  { id: "skill-google-search", type: "skill", label: "google-search" },
  { id: "skill-chain-analyzer", type: "skill", label: "chain-analyzer" },
  { id: "skill-code-review", type: "skill", label: "code-review" },
  { id: "skill-summarizer", type: "skill", label: "summarizer" },
  { id: "skill-wallet-monitor", type: "skill", label: "wallet-monitor" },
];

const DEMO_EDGES = [
  { source: "agent-a1", target: "knowledge-k1", type: "authored" },
  { source: "agent-a2", target: "knowledge-k2", type: "authored" },
  { source: "agent-a3", target: "knowledge-k3", type: "authored" },
  { source: "agent-a1", target: "knowledge-k4", type: "authored" },
  { source: "agent-a2", target: "knowledge-k5", type: "authored" },
  { source: "agent-a2", target: "knowledge-k1", type: "verified" },
  { source: "agent-a3", target: "knowledge-k2", type: "verified" },
  { source: "agent-a1", target: "knowledge-k3", type: "verified" },
  { source: "knowledge-k1", target: "skill-google-search", type: "related_skill" },
  { source: "knowledge-k2", target: "skill-chain-analyzer", type: "related_skill" },
  { source: "knowledge-k3", target: "skill-code-review", type: "related_skill" },
  { source: "knowledge-k4", target: "skill-summarizer", type: "related_skill" },
  { source: "knowledge-k5", target: "skill-wallet-monitor", type: "related_skill" },
  { source: "knowledge-k5", target: "skill-chain-analyzer", type: "related_skill" },
];

async function getGraphData() {
  try {
    const graph = await buildKnowledgeGraph();
    if (graph.nodes.length > 0) {
      return graph;
    }
  } catch {
    // DB not available
  }
  return { nodes: DEMO_NODES, edges: DEMO_EDGES };
}

export default async function KnowledgeGraphPage() {
  const [{ nodes, edges }, t] = await Promise.all([
    getGraphData(),
    getTranslations("knowledgeGraph"),
  ]);

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mb-4 text-lg text-zinc-500">
          {t("description")}
        </p>

        {/* Legend */}
        <div className="mb-6 flex gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{t("legendAgent")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{t("legendKnowledge")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{t("legendSkill")}</span>
          </div>
        </div>

        <KnowledgeGraph nodes={nodes} edges={edges} />
      </div>
    </div>
  );
}
