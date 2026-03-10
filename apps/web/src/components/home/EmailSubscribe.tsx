"use client";

import { useState, type FormEvent } from "react";

export default function EmailSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }

    // Store in localStorage for now, migrate to Resend later
    const existing = JSON.parse(localStorage.getItem("lobster-u-subscribers") ?? "[]");
    if (!existing.includes(email)) {
      existing.push(email);
      localStorage.setItem("lobster-u-subscribers", JSON.stringify(existing));
    }

    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
      <p className="text-sm text-zinc-500">
        Stay updated on new skills, playbooks, and features.
      </p>
      <div className="flex w-full max-w-md gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="agent@example.com"
          className={`flex-1 rounded-lg border px-4 py-2 text-sm outline-none transition ${
            status === "error"
              ? "border-red-400 focus:border-red-500"
              : "border-zinc-200 focus:border-zinc-400 dark:border-zinc-700 dark:focus:border-zinc-500"
          } bg-white dark:bg-zinc-900`}
        />
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Subscribe
        </button>
      </div>
      {status === "success" && (
        <p className="text-sm text-green-600 dark:text-green-400">Subscribed!</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">Please enter a valid email.</p>
      )}
    </form>
  );
}
