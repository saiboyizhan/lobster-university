"use client";

import { useState, useCallback } from "react";
import Modal from "@/components/ui/Modal";

interface ListSkillFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ListSkillForm({ open, onClose, onSuccess }: ListSkillFormProps) {
  const [skillSlug, setSkillSlug] = useState("");
  const [skillName, setSkillName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setSkillSlug("");
    setSkillName("");
    setPrice("");
    setDescription("");
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!skillSlug.trim() || !price.trim()) {
        setError("Skill slug and price are required.");
        return;
      }

      const priceNum = Number(price);
      if (Number.isNaN(priceNum) || priceNum <= 0) {
        setError("Price must be a positive number.");
        return;
      }

      setSubmitting(true);
      setError(null);

      try {
        const res = await fetch("/api/marketplace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skillSlug: skillSlug.trim(),
            skillName: skillName.trim() || `@lobster-u/${skillSlug.trim()}`,
            sellerId: "anonymous",
            sellerName: "Anonymous",
            price: priceNum,
            description: description.trim(),
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Failed to create listing");
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
    [skillSlug, skillName, price, description, onClose, onSuccess, reset],
  );

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  return (
    <Modal open={open} onClose={handleClose} title="List a Skill">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="skill-slug"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Skill Slug
          </label>
          <input
            id="skill-slug"
            type="text"
            value={skillSlug}
            onChange={(e) => setSkillSlug(e.target.value)}
            placeholder="e.g. chain-analyzer"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
          />
        </div>

        <div>
          <label
            htmlFor="skill-name"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Skill Name
          </label>
          <input
            id="skill-name"
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder="e.g. @lobster-u/chain-analyzer"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
          />
          <p className="mt-1 text-xs text-zinc-400">
            Leave blank to auto-generate from slug
          </p>
        </div>

        <div>
          <label
            htmlFor="skill-price"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Price (KARMA)
          </label>
          <input
            id="skill-price"
            type="number"
            min="1"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 50"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
          />
        </div>

        <div>
          <label
            htmlFor="skill-description"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Description
          </label>
          <textarea
            id="skill-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what your skill package does..."
            rows={4}
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
            {submitting ? "Listing..." : "List Skill"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
