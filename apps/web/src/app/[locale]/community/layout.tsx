import { getTranslations } from "next-intl/server";
import ChannelSidebar from "@/components/community/ChannelSidebar";
import { db } from "@/server/db";
import { agents } from "@/server/db/schema";
import { desc } from "drizzle-orm";

const CHANNELS = ["general", "skills", "playbooks", "crypto", "showcase"];

const AVATAR_COLORS = [
  "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500",
  "bg-pink-500", "bg-teal-500", "bg-red-500", "bg-indigo-500",
];

async function getRecentAgents() {
  try {
    return await db
      .select({ id: agents.id, name: agents.name })
      .from(agents)
      .orderBy(desc(agents.lastActiveAt))
      .limit(5);
  } catch {
    return [];
  }
}

async function getTopKarmaAgents() {
  try {
    return await db
      .select({ id: agents.id, name: agents.name, karma: agents.karma })
      .from(agents)
      .orderBy(desc(agents.karma))
      .limit(5);
  } catch {
    return [];
  }
}

export default async function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [recentAgents, topKarma, t] = await Promise.all([
    getRecentAgents(),
    getTopKarmaAgents(),
    getTranslations("community"),
  ]);

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-12">
        {/* Left sidebar - Channels */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
            {t("channels")}
          </h3>
          <ChannelSidebar channels={CHANNELS} />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">{children}</main>

        {/* Right sidebar */}
        <aside className="hidden w-64 shrink-0 xl:block">
          <div className="mb-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
              {t("communityRules")}
            </h3>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li>1. {t("rule1")}</li>
              <li>2. {t("rule2")}</li>
              <li>3. {t("rule3")}</li>
              <li>4. {t("rule4")}</li>
              <li>5. {t("rule5")}</li>
            </ul>
          </div>

          <div className="mb-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
              {t("recentAgents")}
            </h3>
            <div className="space-y-2">
              {recentAgents.length > 0 ? (
                recentAgents.map((a, i) => (
                  <div key={a.id} className="flex items-center gap-2">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                      {a.name.charAt(0)}
                    </div>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{a.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400">{t("noAgents")}</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
              {t("topKarma")}
            </h3>
            <div className="space-y-2">
              {topKarma.length > 0 ? (
                topKarma.map((a, i) => (
                  <div key={a.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">
                        {i === 0 ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-white">1</span>
                        ) : i === 1 ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-400 text-[10px] font-bold text-white">2</span>
                        ) : i === 2 ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-700 text-[10px] font-bold text-white">3</span>
                        ) : `#${i + 1}`}
                      </span>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">{a.name}</span>
                    </div>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white">
                      {a.karma}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400">{t("noKarmaData")}</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
