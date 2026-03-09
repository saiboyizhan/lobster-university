const ALL_SKILLS = [
  { name: "google-search", category: "Information Retrieval", status: "ready", desc: "Search query optimization and result ranking" },
  { name: "academic-search", category: "Information Retrieval", status: "planned", desc: "Academic paper discovery and literature review" },
  { name: "rss-manager", category: "Information Retrieval", status: "planned", desc: "RSS/Atom feed monitoring and summarization" },
  { name: "twitter-intel", category: "Information Retrieval", status: "planned", desc: "Twitter/X intelligence gathering and trend analysis" },
  { name: "reddit-tracker", category: "Information Retrieval", status: "planned", desc: "Reddit trend detection and cross-subreddit correlation" },
  { name: "summarizer", category: "Content Processing", status: "planned", desc: "Multi-format content summarization" },
  { name: "translator", category: "Content Processing", status: "planned", desc: "Context-aware translation and terminology management" },
  { name: "rewriter", category: "Content Processing", status: "planned", desc: "Audience-oriented content rewriting and style transfer" },
  { name: "keyword-extractor", category: "Content Processing", status: "planned", desc: "Multi-level keyword and keyphrase extraction" },
  { name: "sentiment-analyzer", category: "Content Processing", status: "planned", desc: "Aspect-level sentiment analysis" },
  { name: "code-gen", category: "Code Assistance", status: "planned", desc: "Multi-language code generation" },
  { name: "code-review", category: "Code Assistance", status: "planned", desc: "Security, performance, and quality code review" },
  { name: "debugger", category: "Code Assistance", status: "planned", desc: "Systematic bug diagnosis and root cause analysis" },
  { name: "refactor", category: "Code Assistance", status: "planned", desc: "Design-pattern-driven code refactoring" },
  { name: "doc-gen", category: "Code Assistance", status: "planned", desc: "API documentation and README auto-generation" },
  { name: "brainstorm", category: "Creative Generation", status: "planned", desc: "Structured ideation (SCAMPER, Six Hats, TRIZ)" },
  { name: "storyteller", category: "Creative Generation", status: "planned", desc: "Cross-genre narrative creation" },
  { name: "writer", category: "Creative Generation", status: "planned", desc: "Long-form writing and argumentation" },
  { name: "copywriter", category: "Creative Generation", status: "planned", desc: "Persuasion-framework marketing copy" },
  { name: "content-engine", category: "Creative Generation", status: "ready", desc: "Multi-platform content creation and repurposing" },
  { name: "chain-analyzer", category: "Crypto", status: "planned", desc: "On-chain data analysis and whale tracking" },
  { name: "dex-trader", category: "Crypto", status: "planned", desc: "DEX trading strategies and execution" },
  { name: "token-launcher", category: "Crypto", status: "planned", desc: "Token creation and fair launch workflows" },
  { name: "kol-manager", category: "Crypto", status: "planned", desc: "KOL operations and community management" },
  { name: "wallet-monitor", category: "Crypto", status: "planned", desc: "Wallet activity monitoring and alerts" },
  { name: "mental-models", category: "Reasoning", status: "planned", desc: "Latticework thinking (24 Munger mental models)" },
  { name: "assessment", category: "Self-Evolution", status: "planned", desc: "5-dimension capability self-exam" },
  { name: "healthcheck", category: "Self-Evolution", status: "planned", desc: "Autonomous health inspector" },
  { name: "selfoptimize", category: "Self-Evolution", status: "planned", desc: "Autonomous self-improvement from assessment" },
  { name: "certify", category: "Self-Evolution", status: "planned", desc: "Capability certificate generator" },
  { name: "campus-sdk", category: "Self-Evolution", status: "planned", desc: "Social learning network SDK" },
];

export default function SkillsPage() {
  const categories = [...new Set(ALL_SKILLS.map((s) => s.category))];

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
          Skills Library
        </h1>
        <p className="mb-12 text-lg text-zinc-500">
          {ALL_SKILLS.length} atomic skill packages across {categories.length} categories.
          Install only what you need.
        </p>

        {categories.map((cat) => {
          const skills = ALL_SKILLS.filter((s) => s.category === cat);
          return (
            <div key={cat} className="mb-12">
              <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-white">
                {cat}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="text-sm font-medium text-zinc-900 dark:text-white">
                        @lobster-u/{skill.name}
                      </code>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          skill.status === "ready"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {skill.status}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500">{skill.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
