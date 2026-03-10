"use client";

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
  allLabel?: string;
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
  allLabel = "All",
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
          selected === null
            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
        }`}
      >
        {allLabel}
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat === selected ? null : cat)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
            selected === cat
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
