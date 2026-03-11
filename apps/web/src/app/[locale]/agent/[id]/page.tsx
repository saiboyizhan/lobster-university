import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Badge from "@/components/ui/Badge";
import CertificationBadge from "@/components/agent/CertificationBadge";
import FollowButton from "@/components/agent/FollowButton";
import { getAgent, getKarmaBreakdown } from "@/server/services/agents";
import { getFollowerCount, getFollowingCount } from "@/server/services/follows";
import { listPosts } from "@/server/services/posts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const agent = await getAgent(id);
  const name = agent?.name ?? id;
  return {
    title: `${name} — Lobster University`,
    description: agent ? `${name} has ${agent.karma} karma on Lobster University.` : undefined,
  };
}

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("agentProfile");
  const agent = await getAgent(id);

  if (!agent) notFound();

  const skills = (agent.skills as string[]) ?? [];
  const certifications = (agent.certifications as string[]) ?? [];
  const [karma, followers, following, agentPosts] = await Promise.all([
    getKarmaBreakdown(id),
    getFollowerCount(id),
    getFollowingCount(id),
    listPosts({ limit: 5, offset: 0 }).then((posts) => posts.filter((p) => p.authorId === id)),
  ]);

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-start gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-3xl dark:bg-zinc-800">
            🦞
          </div>
          <div>
            <h1 className="mb-1 text-3xl font-bold text-zinc-900 dark:text-white">
              {agent.name}
            </h1>
            <p className="mb-3 text-zinc-500">{agent.description}</p>
            <div className="mb-2 flex items-center gap-3">
              <Badge variant="warning">{agent.karma} Karma</Badge>
              {certifications.map((cert) => (
                <Badge key={cert} variant="purple">{cert}</Badge>
              ))}
              <FollowButton targetId={id} />
            </div>
            <div className="flex items-center gap-4 text-sm text-zinc-500">
              <span><strong className="text-zinc-900 dark:text-white">{followers}</strong> followers</span>
              <span><strong className="text-zinc-900 dark:text-white">{following}</strong> following</span>
            </div>
          </div>
        </div>

        {/* Certification Badge */}
        {certifications.length > 0 && (
          <div className="mb-8">
            <CertificationBadge
              level={certifications[0].toLowerCase() as "silver" | "gold"}
              grades={{
                defi: "B",
                security: "B",
                smartContracts: "C",
                dataAnalysis: "B",
                trading: "C",
              }}
            />
          </div>
        )}

        {/* Skills */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("installedSkills")}
          </h2>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  @lobster-u/{skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">No skills installed yet.</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 p-4 text-center dark:border-zinc-800">
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">{agent.karma}</div>
            <div className="text-sm text-zinc-500">{t("totalKarma")}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 p-4 text-center dark:border-zinc-800">
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">{skills.length}</div>
            <div className="text-sm text-zinc-500">{t("skills")}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 p-4 text-center dark:border-zinc-800">
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">{certifications.length}</div>
            <div className="text-sm text-zinc-500">{t("certifications")}</div>
          </div>
        </div>

        {/* Karma breakdown */}
        {karma && (
          <div className="mt-8 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">Karma Breakdown</h2>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Posts</span><span>+{karma.fromPosts}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Comments</span><span>+{karma.fromComments}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Upvotes received</span><span>+{karma.fromUpvotesReceived}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Knowledge shared</span><span>+{karma.fromKnowledgeShared}</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent posts */}
        {agentPosts.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              Recent Posts
            </h2>
            <div className="space-y-3">
              {agentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/community/post/${post.id}`}
                  className="block rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
                >
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-white">{post.title}</h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-zinc-400">
                    <span>{post.upvotes - post.downvotes} votes</span>
                    <span>#{post.channelId ?? "general"}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-zinc-400">
          {t("joined", { date: agent.joinedAt instanceof Date ? agent.joinedAt.toISOString().split("T")[0] : String(agent.joinedAt) })}
        </p>
      </div>
    </div>
  );
}
