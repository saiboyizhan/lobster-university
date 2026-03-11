import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSkillDetail, getAllSkillSlugs } from "@/lib/skills";
import { getCourseBySkillSlug } from "@/server/services/courses";
import InstallCommand from "@/components/skills/InstallCommand";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import Badge from "@/components/ui/Badge";

export function generateStaticParams() {
  return getAllSkillSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkillDetail(slug);
  if (!skill) return { title: "Skill Not Found" };
  return {
    title: `${skill.name} — Lobster University`,
    description: skill.description,
  };
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getSkillDetail(slug);
  if (!skill) notFound();

  const t = await getTranslations("courses");
  let course: Awaited<ReturnType<typeof getCourseBySkillSlug>> = null;
  try {
    course = await getCourseBySkillSlug(slug);
  } catch {
    // DB not available
  }

  const depSlugs = Object.keys(skill.dependencies).map((d) =>
    d.replace("@lobster-u/", "")
  );

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-zinc-500">
          <Link href="/skills" className="hover:text-zinc-900 dark:hover:text-white">
            Skills
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-900 dark:text-white">{skill.slug}</span>
        </nav>

        {/* Course badge */}
        {course && (
          <Link
            href={`/courses/${course.code}`}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
          >
            <span className="text-xs font-medium">{t("partOfCourse")}</span>
            <span className="font-mono font-bold">{course.code}</span>
            <span>{course.title}</span>
          </Link>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
            {skill.name}
          </h1>
          <p className="mb-4 text-lg text-zinc-500">{skill.description}</p>
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="info">{skill.category}</Badge>
            {skill.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          {skill.expectedImprovement > 0 && (
            <p className="text-sm text-zinc-500">
              Expected improvement: <strong>+{skill.expectedImprovement}%</strong>
            </p>
          )}
        </div>

        {/* Install */}
        <div className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
            Install
          </h2>
          <InstallCommand packageName={skill.name} />
        </div>

        {/* Dependencies */}
        {depSlugs.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
              Dependencies
            </h2>
            <div className="flex flex-wrap gap-2">
              {depSlugs.map((dep) => (
                <Link
                  key={dep}
                  href={`/skills/${dep}`}
                  className="rounded-md bg-zinc-100 px-3 py-1 text-sm text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  @lobster-u/{dep}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Capabilities */}
        {skill.capabilities.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
              Capabilities
            </h2>
            <ul className="list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              {skill.capabilities.map((cap) => (
                <li key={cap}>{cap}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Triggers */}
        {skill.triggers.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
              Triggers
            </h2>
            <div className="flex flex-wrap gap-2">
              {skill.triggers.map((trigger) => (
                <code
                  key={trigger}
                  className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  &quot;{trigger}&quot;
                </code>
              ))}
            </div>
          </div>
        )}

        {/* SKILL.md */}
        {skill.skillMd && (
          <div className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
              Role Definition
            </h2>
            <MarkdownRenderer content={skill.skillMd} />
          </div>
        )}

        {/* Knowledge */}
        {skill.knowledge.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
              Knowledge
            </h2>
            {skill.knowledge.map((k) => (
              <details key={k.filename} className="mb-3">
                <summary className="cursor-pointer text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                  {k.filename.replace(".md", "")}
                </summary>
                <div className="mt-2">
                  <MarkdownRenderer content={k.content} />
                </div>
              </details>
            ))}
          </div>
        )}

        {/* Strategies */}
        {skill.strategies.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">
              Strategies
            </h2>
            {skill.strategies.map((s) => (
              <details key={s.filename} className="mb-3">
                <summary className="cursor-pointer text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                  {s.filename.replace(".md", "")}
                </summary>
                <div className="mt-2">
                  <MarkdownRenderer content={s.content} />
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
