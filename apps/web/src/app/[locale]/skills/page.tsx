import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { getAllSkills, getCategories } from "@/lib/skills";
import SkillsExplorer from "@/components/skills/SkillsExplorer";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("skills");
  return { title: t("title") };
}

export default function SkillsPage() {
  const t = useTranslations("skills");
  const skills = getAllSkills();
  const categories = getCategories();

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mb-8 text-lg text-zinc-500">
          {t("description", { count: skills.length, categories: categories.length })}
        </p>

        <SkillsExplorer
          skills={skills}
          categories={categories}
          searchPlaceholder={t("search")}
          allLabel={t("allCategories")}
        />
      </div>
    </div>
  );
}
