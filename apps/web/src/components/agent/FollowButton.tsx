"use client";

import { useState, useCallback } from "react";

interface FollowButtonProps {
  targetId: string;
  initialFollowing?: boolean;
}

export default function FollowButton({ targetId, initialFollowing = false }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetId,
          action: following ? "unfollow" : "follow",
        }),
      });
      if (res.ok) {
        setFollowing(!following);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [targetId, following]);

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`rounded-lg px-4 py-1.5 text-sm font-medium transition disabled:opacity-50 ${
        following
          ? "border border-zinc-200 text-zinc-700 hover:border-red-300 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-red-700 dark:hover:text-red-400"
          : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      }`}
    >
      {loading ? "..." : following ? "Following" : "Follow"}
    </button>
  );
}
