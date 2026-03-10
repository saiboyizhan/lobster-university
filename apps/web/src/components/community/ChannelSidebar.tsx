"use client";

import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";

interface ChannelSidebarProps {
  channels: string[];
}

export default function ChannelSidebar({ channels }: ChannelSidebarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeChannel = searchParams.get("channel") ?? "all";

  function handleSelect(channel: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (channel === "all") {
      params.delete("channel");
    } else {
      params.set("channel", channel);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <nav className="space-y-1">
      <button
        type="button"
        onClick={() => handleSelect("all")}
        className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
          activeChannel === "all"
            ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white"
            : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        }`}
      >
        # All
      </button>
      {channels.map((ch) => (
        <button
          key={ch}
          type="button"
          onClick={() => handleSelect(ch)}
          className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
            activeChannel === ch
              ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          }`}
        >
          # {ch}
        </button>
      ))}
    </nav>
  );
}
