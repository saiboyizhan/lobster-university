"use client";

import { useState, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import type { Skill } from "@/lib/skills";
import SkillSearch from "./SkillSearch";
import CategoryFilter from "./CategoryFilter";

interface SkillsExplorerProps {
  skills: Skill[];
  categories: string[];
  searchPlaceholder: string;
  allLabel: string;
}

export default function SkillsExplorer({
  skills,
  categories,
  searchPlaceholder,
  allLabel,
}: SkillsExplorerProps) {
  const [filteredBySearch, setFilteredBySearch] = useState<Skill[]>(skills);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSearchFilter = useCallback((filtered: Skill[]) => {
    setFilteredBySearch(filtered);
  }, []);

  const displayed = selectedCategory
    ? filteredBySearch.filter((s) => s.category === selectedCategory)
    : filteredBySearch;

  const groupedByCategory = displayed.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SkillSearch skills={skills} onFilter={handleSearchFilter} placeholder={searchPlaceholder} />
        </div>
      </div>
      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          allLabel={allLabel}
        />
      </div>

      {Object.entries(groupedByCategory).map(([category, categorySkills]) => (
        <div key={category} className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-white">
            {category}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categorySkills.map((skill) => (
              <Link
                key={skill.slug}
                href={`/skills/${skill.slug}`}
                className="group rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <div className="mb-2 flex items-center justify-between">
                  <code className="text-sm font-medium text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {skill.name}
                  </code>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">
                    ready
                  </span>
                </div>
                <p className="text-sm text-zinc-500">{skill.description}</p>
                {skill.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {skill.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}

      {displayed.length === 0 && (
        <p className="py-12 text-center text-zinc-500">No skills found.</p>
      )}
    </>
  );
}
