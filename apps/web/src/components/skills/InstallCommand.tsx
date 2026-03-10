"use client";

import { useState } from "react";

interface InstallCommandProps {
  packageName: string;
}

export default function InstallCommand({ packageName }: InstallCommandProps) {
  const [copied, setCopied] = useState(false);
  const command = `lobster-u install ${packageName}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-950 px-4 py-3 dark:border-zinc-800">
      <code className="flex-1 text-sm text-green-400">{command}</code>
      <button
        onClick={handleCopy}
        className="rounded px-2 py-1 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
