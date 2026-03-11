"use client";

import { useState, useCallback, useTransition } from "react";

interface VoteButtonsProps {
  postId: string;
  initialUpvotes: number;
  initialDownvotes: number;
  size?: "sm" | "md";
}

export default function VoteButtons({
  postId,
  initialUpvotes,
  initialDownvotes,
  size = "sm",
}: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [voted, setVoted] = useState<1 | -1 | null>(null);
  const [isPending, startTransition] = useTransition();
  const [authError, setAuthError] = useState(false);

  const iconSize = size === "md" ? "h-5 w-5" : "h-4 w-4";
  const scoreSize =
    size === "md"
      ? "min-w-[2ch] text-center text-lg font-bold"
      : "min-w-[2ch] text-center text-sm font-medium";

  const handleVote = useCallback(
    (direction: 1 | -1) => {
      // If already voted in this direction, undo
      if (voted === direction) {
        const prevUp = upvotes;
        const prevDown = downvotes;

        // Optimistic: revert the vote
        if (direction === 1) setUpvotes((v) => v - 1);
        else setDownvotes((v) => v - 1);
        setVoted(null);

        startTransition(async () => {
          try {
            const res = await fetch("/api/posts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "vote",
                postId,
                direction,
              }),
            });
            if (res.status === 401) { setAuthError(true); throw new Error("login required"); }
            if (!res.ok) throw new Error("vote failed");
          } catch {
            // Revert on error
            setUpvotes(prevUp);
            setDownvotes(prevDown);
            setVoted(direction);
          }
        });
        return;
      }

      const prevUp = upvotes;
      const prevDown = downvotes;
      const prevVoted = voted;

      // Optimistic update
      if (voted !== null) {
        // Undo previous vote
        if (voted === 1) setUpvotes((v) => v - 1);
        else setDownvotes((v) => v - 1);
      }
      if (direction === 1) setUpvotes((v) => v + 1);
      else setDownvotes((v) => v + 1);
      setVoted(direction);

      startTransition(async () => {
        try {
          const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "vote",
              postId,
              direction,
            }),
          });
          if (!res.ok) throw new Error("vote failed");
        } catch {
          // Revert on error
          setUpvotes(prevUp);
          setDownvotes(prevDown);
          setVoted(prevVoted);
        }
      });
    },
    [postId, upvotes, downvotes, voted],
  );

  return (
    <div
      className="flex items-center gap-1"
      onClick={(e) => e.preventDefault()}
      title={authError ? "Please log in to vote" : undefined}
    >
      <button
        type="button"
        disabled={isPending}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleVote(1);
        }}
        className={`transition disabled:opacity-50 ${
          voted === 1
            ? "text-green-600"
            : "text-zinc-400 hover:text-green-600"
        }`}
        aria-label="Upvote"
      >
        <svg
          className={iconSize}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
      <span
        className={`${scoreSize} text-zinc-900 dark:text-white`}
      >
        {upvotes - downvotes}
      </span>
      <button
        type="button"
        disabled={isPending}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleVote(-1);
        }}
        className={`transition disabled:opacity-50 ${
          voted === -1
            ? "text-red-600"
            : "text-zinc-400 hover:text-red-600"
        }`}
        aria-label="Downvote"
      >
        <svg
          className={iconSize}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  );
}
