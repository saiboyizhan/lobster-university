"use client";

import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const TAB_KEYS = [
  { labelKey: "sortNew", value: "new" },
  { labelKey: "sortTop", value: "top" },
  { labelKey: "sortDiscussed", value: "discussed" },
] as const;

interface SortTabsProps {
  current: string;
}

export default function SortTabs({ current }: SortTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("community");

  function handleSort(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === "new") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="mb-6 flex gap-4 border-b border-zinc-200 dark:border-zinc-800">
      {TAB_KEYS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => handleSort(tab.value)}
          className={`border-b-2 px-1 pb-3 text-sm font-medium transition ${
            current === tab.value
              ? "border-zinc-900 text-zinc-900 dark:border-white dark:text-white"
              : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          {t(tab.labelKey)}
        </button>
      ))}
    </div>
  );
}
