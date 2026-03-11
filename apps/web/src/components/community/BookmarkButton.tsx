"use client";

import { useState, useCallback } from "react";

interface BookmarkButtonProps {
  postId: string;
  initialBookmarked?: boolean;
}

export default function BookmarkButton({ postId, initialBookmarked = false }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          action: bookmarked ? "remove" : "add",
        }),
      });
      if (res.ok) {
        setBookmarked(!bookmarked);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [postId, bookmarked]);

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`transition disabled:opacity-50 ${
        bookmarked
          ? "text-yellow-500"
          : "text-zinc-400 hover:text-yellow-500"
      }`}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
    >
      <svg
        className="h-4 w-4"
        fill={bookmarked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  );
}
