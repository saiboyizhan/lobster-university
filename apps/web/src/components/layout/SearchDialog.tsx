"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface SearchResult {
  type: "skill" | "post" | "agent" | "knowledge" | "course" | "faculty" | "group";
  id: string;
  title: string;
  description: string;
  url: string;
}

const TYPE_LABEL_KEYS: Record<string, string> = {
  skill: "typeSkill",
  post: "typePost",
  agent: "typeAgent",
  knowledge: "typeKnowledge",
  course: "typeCourse",
  faculty: "typeFaculty",
  group: "typeGroup",
};

const TYPE_COLORS: Record<string, string> = {
  skill: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  post: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  agent: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  knowledge: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  course: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  faculty: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  group: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
};

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useTranslations("search");

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  // Search on query change
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results);
          setSelectedIndex(0);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [query]);

  const navigate = useCallback(
    (url: string) => {
      setOpen(false);
      router.push(url);
    },
    [router],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        navigate(results[selectedIndex].url);
      }
    },
    [results, selectedIndex, navigate],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="animate-fade-in absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Dialog */}
      <div className="animate-scale-in relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        {/* Search input */}
        <div className="flex items-center border-b border-zinc-200 px-4 dark:border-zinc-700">
          <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("placeholder")}
            className="w-full bg-transparent px-3 py-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-white"
          />
          <kbd className="hidden rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-400 sm:inline dark:border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {loading && (
            <div className="px-3 py-4 text-center text-sm text-zinc-400">{t("searching")}</div>
          )}
          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="px-3 py-4 text-center text-sm text-zinc-400">{t("noResults")}</div>
          )}
          {results.map((result, i) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => navigate(result.url)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                i === selectedIndex
                  ? "bg-zinc-100 dark:bg-zinc-800"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[result.type]}`}>
                {t(TYPE_LABEL_KEYS[result.type])}
              </span>
              <div className="min-w-0">
                <div className="truncate font-medium text-zinc-900 dark:text-white">
                  {result.title}
                </div>
                {result.description && (
                  <div className="truncate text-xs text-zinc-400">{result.description}</div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        {!loading && query.length < 2 && (
          <div className="border-t border-zinc-200 px-4 py-2 text-xs text-zinc-400 dark:border-zinc-700">
            {t("minChars")}
          </div>
        )}
      </div>
    </div>
  );
}
