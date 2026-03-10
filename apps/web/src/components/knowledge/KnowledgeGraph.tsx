"use client";

import { useCallback, useState, useEffect } from "react";
import dynamic from "next/dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false }) as any;

interface GraphNode {
  id: string;
  type: string;
  label: string;
}

interface GraphEdge {
  source: string;
  target: string;
  type: string;
}

interface KnowledgeGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const NODE_COLORS: Record<string, string> = {
  agent: "#3b82f6",
  knowledge: "#22c55e",
  skill: "#f97316",
};

const EDGE_COLORS: Record<string, string> = {
  authored: "#3b82f6",
  verified: "#22c55e",
  related_skill: "#f97316",
};

export default function KnowledgeGraph({ nodes, edges }: KnowledgeGraphProps) {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const updateSize = () => {
      const container = document.getElementById("graph-container");
      if (container) {
        setDimensions({ width: container.offsetWidth, height: 500 });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const graphData = {
    nodes: nodes.map((n) => ({ ...n })),
    links: edges.map((e) => ({ source: e.source, target: e.target, type: e.type })),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNodeClick = useCallback((node: any) => {
    const found = nodes.find((n) => n.id === node.id);
    setSelectedNode(found ?? null);
  }, [nodes]);

  return (
    <div>
      <div id="graph-container" className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <ForceGraph2D
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="transparent"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nodeLabel={(node: any) => `${node.label} (${node.type})`}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nodeColor={(node: any) => NODE_COLORS[node.type] ?? "#888"}
          nodeRelSize={6}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          linkColor={(link: any) => EDGE_COLORS[link.type ?? ""] ?? "#666"}
          linkWidth={1.5}
          linkDirectionalArrowLength={4}
          linkDirectionalArrowRelPos={1}
          onNodeClick={handleNodeClick}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const fontSize = 12 / globalScale;
            const color = NODE_COLORS[node.type] ?? "#888";
            const x = node.x ?? 0;
            const y = node.y ?? 0;

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();

            ctx.font = `${fontSize}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillStyle = color;
            ctx.fillText(node.label, x, y + 7);
          }}
        />
      </div>

      {selectedNode && (
        <div className="mt-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: NODE_COLORS[selectedNode.type] }}
            />
            <span className="text-sm font-medium text-zinc-900 dark:text-white">
              {selectedNode.label}
            </span>
            <span className="text-xs text-zinc-400">({selectedNode.type})</span>
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            Connections: {edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id).length}
          </div>
        </div>
      )}
    </div>
  );
}
