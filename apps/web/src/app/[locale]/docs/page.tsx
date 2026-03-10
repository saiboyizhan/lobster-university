import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getDocPage } from "@/lib/docs";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("docs");
  return { title: t("title") };
}

export default async function DocsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const doc = getDocPage("index", locale);

  if (!doc) {
    return (
      <div>
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
          Documentation
        </h1>
        <p className="text-zinc-500">Documentation content is being prepared.</p>
      </div>
    );
  }

  return (
    <div>
      <MarkdownRenderer content={doc.content} />
    </div>
  );
}
