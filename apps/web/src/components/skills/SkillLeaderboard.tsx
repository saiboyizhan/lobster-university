"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

interface LeaderboardEntry {
  slug: string;
  name: string;
  category: string;
  score: number;
}

interface SkillLeaderboardProps {
  overall: LeaderboardEntry[];
  learning: LeaderboardEntry[];
  playbookCovered: LeaderboardEntry[];
}

type Tab = "overall" | "learning" | "playbook";

const TABS: { key: Tab; label: string; scoreLabel: string }[] = [
  { key: "overall", label: "Overall", scoreLabel: "Impact Score" },
  { key: "learning", label: "Learning Value", scoreLabel: "Improvement %" },
  { key: "playbook", label: "Playbook Coverage", scoreLabel: "Playbooks" },
];

export default function SkillLeaderboard({
  overall,
  learning,
  playbookCovered,
}: SkillLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overall");

  const data =
    activeTab === "overall"
      ? overall
      : activeTab === "learning"
        ? learning
        : playbookCovered;

  const scoreLabel = TABS.find((t) => t.key === activeTab)?.scoreLabel ?? "Score";

  return (
    <>
      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Skill</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Category</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">{scoreLabel}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, i) => (
              <tr
                key={entry.slug}
                className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
              >
                <td className="px-4 py-3 text-sm text-zinc-400">{i + 1}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/skills/${entry.slug}`}
                    className="text-sm font-medium text-zinc-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                  >
                    {entry.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-zinc-500">{entry.category}</td>
                <td className="px-4 py-3 text-right text-sm font-medium text-zinc-900 dark:text-white">
                  {entry.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
