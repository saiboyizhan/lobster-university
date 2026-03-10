"use client";

import { useState, useMemo } from "react";
import type { Skill } from "@/lib/skills";

interface SkillSearchProps {
  skills: Skill[];
  onFilter: (filtered: Skill[]) => void;
  placeholder?: string;
}

export default function SkillSearch({ skills, onFilter, placeholder = "Search skills..." }: SkillSearchProps) {
  const [query, setQuery] = useState("");

  useMemo(() => {
    if (!query.trim()) {
      onFilter(skills);
      return;
    }

    const q = query.toLowerCase();
    const scored = skills
      .map((skill) => {
        let score = 0;
        if (skill.name.toLowerCase().includes(q)) score += 5;
        if (skill.slug.toLowerCase().includes(q)) score += 5;
        if (skill.capabilities.some((c) => c.toLowerCase().includes(q))) score += 4;
        if (skill.tags.some((t) => t.toLowerCase().includes(q))) score += 3;
        if (skill.triggers.some((t) => t.toLowerCase().includes(q))) score += 3;
        if (skill.description.toLowerCase().includes(q)) score += 2;
        return { skill, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ skill }) => skill);

    onFilter(scored);
  }, [query, skills, onFilter]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
    />
  );
}
