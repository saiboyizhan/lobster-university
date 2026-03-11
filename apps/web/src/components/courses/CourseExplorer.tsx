"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  credits: number;
  departmentName: string;
  collegeSlug: string;
  collegeName: string;
}

interface College {
  slug: string;
  name: string;
  iconEmoji: string;
}

interface CourseExplorerProps {
  courses: Course[];
  colleges: College[];
}

export default function CourseExplorer({ courses, colleges }: CourseExplorerProps) {
  const [search, setSearch] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = courses;
    if (selectedCollege) {
      result = result.filter((c) => c.collegeSlug === selectedCollege);
    }
    if (search.length >= 2) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.departmentName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [courses, search, selectedCollege]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code or title..."
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none sm:w-64 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCollege(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              !selectedCollege
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            All
          </button>
          {colleges.map((col) => (
            <button
              key={col.slug}
              onClick={() => setSelectedCollege(col.slug === selectedCollege ? null : col.slug)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                selectedCollege === col.slug
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {col.iconEmoji} {col.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="text-sm text-zinc-400 mb-4">
        {filtered.length} results
      </div>
      <div className="space-y-3">
        {filtered.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.code}`}
            className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span className="shrink-0 rounded bg-zinc-100 px-2 py-0.5 text-xs font-mono font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {course.code}
                </span>
                <span className="truncate font-medium text-zinc-900 dark:text-white">
                  {course.title}
                </span>
              </div>
              <div className="flex gap-3 text-xs text-zinc-400">
                <span>{course.collegeName}</span>
                <span>{course.departmentName}</span>
              </div>
            </div>
            <span className="shrink-0 ml-4 text-sm font-medium text-zinc-500">
              {course.credits} cr
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
