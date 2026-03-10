import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDocPage, getDocSlugs } from "@/lib/docs";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

export function generateStaticParams() {
  const slugs = getDocSlugs("en");
  return slugs.filter((s) => s !== "index").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const doc = getDocPage(slug, locale);
  if (!doc) return { title: "Doc Not Found" };
  return { title: `${doc.title} — Documentation` };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const doc = getDocPage(slug, locale);
  if (!doc) notFound();

  return (
    <div>
      <MarkdownRenderer content={doc.content} />
    </div>
  );
}
