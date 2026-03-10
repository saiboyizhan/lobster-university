"use client";

interface PlaybookFilterProps {
  selectedLevel: string | null;
  selectedCategory: string | null;
  onLevelChange: (level: string | null) => void;
  onCategoryChange: (category: string | null) => void;
}

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const CATEGORIES = ["general", "crypto"];

export default function PlaybookFilter({
  selectedLevel,
  selectedCategory,
  onLevelChange,
  onCategoryChange,
}: PlaybookFilterProps) {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex flex-wrap gap-2">
        <span className="mr-1 text-xs font-medium text-zinc-400">Difficulty:</span>
        <button
          onClick={() => onLevelChange(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            selectedLevel === null
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          All
        </button>
        {LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => onLevelChange(level === selectedLevel ? null : level)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              selectedLevel === level
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            {level}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="mr-1 text-xs font-medium text-zinc-400">Category:</span>
        <button
          onClick={() => onCategoryChange(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            selectedCategory === null
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat === selectedCategory ? null : cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
              selectedCategory === cat
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
