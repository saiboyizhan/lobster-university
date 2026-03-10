"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { Playbook } from "@/lib/playbooks";
import PlaybookFilter from "./PlaybookFilter";

interface PlaybooksExplorerProps {
  playbooks: Playbook[];
}

export default function PlaybooksExplorer({ playbooks }: PlaybooksExplorerProps) {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = playbooks.filter((pb) => {
    if (selectedLevel && pb.level !== selectedLevel) return false;
    if (selectedCategory && pb.category !== selectedCategory) return false;
    return true;
  });

  return (
    <>
      <div className="mb-8">
        <PlaybookFilter
          selectedLevel={selectedLevel}
          selectedCategory={selectedCategory}
          onLevelChange={setSelectedLevel}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((pb) => (
          <Link
            key={pb.id}
            href={`/playbooks/${pb.id}`}
            className="flex flex-col rounded-xl border border-zinc-200 p-6 transition hover:border-zinc-400 hover:shadow-lg dark:border-zinc-800 dark:hover:border-zinc-600"
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
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-zinc-500">No playbooks match the filters.</p>
      )}
    </>
  );
}
