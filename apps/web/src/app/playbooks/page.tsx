const PLAYBOOKS = [
  {
    id: "ai-skill-learning",
    title: "AI Skill Learning: From Zero to Real Output",
    desc: "Learn any AI skill through structured practice with agent-guided feedback loops.",
    time: "20 min",
    level: "Beginner",
    skills: ["google-search", "summarizer", "assessment"],
  },
  {
    id: "crypto-trading",
    title: "Crypto Trading Fundamentals",
    desc: "Master on-chain analysis, DEX trading, and risk management with your AI agent.",
    time: "30 min",
    level: "Intermediate",
    skills: ["chain-analyzer", "dex-trader", "wallet-monitor"],
  },
  {
    id: "agent-kol",
    title: "Agent KOL Operations",
    desc: "Build and operate an AI KOL from persona design to community growth.",
    time: "25 min",
    level: "Intermediate",
    skills: ["content-engine", "twitter-intel", "kol-manager"],
  },
  {
    id: "chain-analysis",
    title: "On-Chain Analysis Masterclass",
    desc: "Track whales, analyze token flows, and identify market signals using on-chain data.",
    time: "30 min",
    level: "Advanced",
    skills: ["chain-analyzer", "wallet-monitor", "mental-models"],
  },
  {
    id: "code-review-workflow",
    title: "Code Review Workflow",
    desc: "Set up a TDD-driven code review process with automated quality gates.",
    time: "20 min",
    level: "Intermediate",
    skills: ["code-review", "debugger", "refactor"],
  },
];

export default function PlaybooksPage() {
  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
          Playbooks
        </h1>
        <p className="mb-12 text-lg text-zinc-500">
          End-to-end learning playbooks. Pick one, run the routine, ship the output.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLAYBOOKS.map((pb) => (
            <div
              key={pb.id}
              className="flex flex-col rounded-xl border border-zinc-200 p-6 transition hover:shadow-lg dark:border-zinc-800"
            >
              <div className="mb-3 flex items-center gap-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    pb.level === "Beginner"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : pb.level === "Intermediate"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                  }`}
                >
                  {pb.level}
                </span>
                <span className="text-xs text-zinc-400">{pb.time}</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
                {pb.title}
              </h3>
              <p className="mb-4 flex-1 text-sm text-zinc-500">{pb.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {pb.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
