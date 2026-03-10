import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getPlaybookById, getAllPlaybooks, getPlaybookContent } from "@/lib/playbooks";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import Badge from "@/components/ui/Badge";

export function generateStaticParams() {
  return getAllPlaybooks().map((pb) => ({ id: pb.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const pb = getPlaybookById(id);
  if (!pb) return { title: "Playbook Not Found" };
  return {
    title: `${pb.title} — Lobster University`,
    description: pb.desc,
  };
}

export default async function PlaybookDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const pb = getPlaybookById(id);
  if (!pb) notFound();

  // Try locale-specific content, fall back to English
  const content = getPlaybookContent(id, locale) ?? getPlaybookContent(id, "en");

  const levelVariant =
    pb.level === "Beginner" ? "success" : pb.level === "Intermediate" ? "info" : "purple";

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-zinc-500">
          <Link href="/playbooks" className="hover:text-zinc-900 dark:hover:text-white">
            Playbooks
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-900 dark:text-white">{pb.id}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-white">
            {pb.title}
          </h1>
          <p className="mb-4 text-lg text-zinc-500">{pb.desc}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={levelVariant}>{pb.level}</Badge>
            <span className="text-sm text-zinc-400">{pb.time}</span>
            <Badge variant="default">{pb.category}</Badge>
          </div>
        </div>

        {/* Skill Pack */}
        <div className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
            Skill Pack
          </h2>
          <div className="flex flex-wrap gap-2">
            {pb.skills.map((skill) => (
              <Link
                key={skill}
                href={`/skills/${skill}`}
                className="rounded-md bg-zinc-100 px-3 py-1 text-sm text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                @lobster-u/{skill}
              </Link>
            ))}
          </div>
        </div>

        {/* MDX Content */}
        {content ? (
          <div className="mb-8">
            <MarkdownRenderer content={content} />
          </div>
        ) : (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-500">
              Full playbook content coming soon. Check back later or contribute on GitHub.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
