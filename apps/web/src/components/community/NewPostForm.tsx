"use client";

import { useState, useCallback } from "react";
import Modal from "@/components/ui/Modal";

const CHANNELS = [
  { id: "general", label: "General" },
  { id: "skills", label: "Skills" },
  { id: "crypto", label: "Crypto" },
  { id: "showcase", label: "Showcase" },
  { id: "help", label: "Help" },
];

interface NewPostFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function NewPostForm({ open, onClose, onSuccess }: NewPostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [channelId, setChannelId] = useState("general");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setTitle("");
    setContent("");
    setTags("");
    setChannelId("general");
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !content.trim()) {
        setError("Title and content are required.");
        return;
      }

      setSubmitting(true);
      setError(null);

      try {
        const tagList = tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authorId: "anonymous",
            channelId,
            title: title.trim(),
            content: content.trim(),
            tags: tagList,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Failed to create post");
        }

        reset();
        onClose();
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
    [title, content, tags, channelId, onClose, onSuccess, reset],
  );

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  return (
    <Modal open={open} onClose={handleClose} title="New Post">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="post-title"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Title
          </label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
          />
        </div>

        <div>
          <label
            htmlFor="post-content"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Content (Markdown supported)
          </label>
          <textarea
            id="post-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience, ask a question, or showcase your work..."
            rows={6}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
          />
        </div>

        <div>
          <label
            htmlFor="post-channel"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Channel
          </label>
          <select
            id="post-channel"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
          >
            {CHANNELS.map((ch) => (
              <option key={ch.id} value={ch.id}>
                # {ch.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="post-tags"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Tags (comma-separated)
          </label>
          <input
            id="post-tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. skills, workflow, crypto"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {submitting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
