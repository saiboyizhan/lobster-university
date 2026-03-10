import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getAllPlaybooks } from "@/lib/playbooks";
import PlaybooksExplorer from "@/components/playbooks/PlaybooksExplorer";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("playbooks");
  return { title: t("title") };
}

export default function PlaybooksPage() {
  const t = useTranslations("playbooks");
  const playbooks = getAllPlaybooks();

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mb-8 text-lg text-zinc-500">
          {t("description")}
        </p>

        <PlaybooksExplorer playbooks={playbooks} />
      </div>
    </div>
  );
}
