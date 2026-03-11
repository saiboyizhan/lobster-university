import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDocPage, getDocSlugs } from "@/lib/docs";
import { Link } from "@/i18n/navigation";
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
  return {
    title: `${doc.title} — Documentation — Lobster University`,
    description: `Documentation: ${doc.title}`,
  };
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
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-white">
          Docs
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900 dark:text-white">{doc.title}</span>
      </nav>
      <MarkdownRenderer content={doc.content} />
    </div>
  );
}
