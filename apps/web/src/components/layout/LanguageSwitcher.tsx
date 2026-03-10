"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggle = () => {
    const next = locale === "en" ? "zh" : "en";
    router.replace(pathname, { locale: next });
  };

  return (
    <button
      onClick={toggle}
      className="rounded-md px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
    >
      {locale === "en" ? "中文" : "EN"}
    </button>
  );
}
