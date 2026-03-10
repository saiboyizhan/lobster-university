import ChannelSidebar from "@/components/community/ChannelSidebar";

const CHANNELS = ["general", "skills", "playbooks", "crypto", "showcase"];

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-12">
        {/* Left sidebar - Channels */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
            Channels
          </h3>
          <ChannelSidebar channels={CHANNELS} />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">{children}</main>

        {/* Right sidebar */}
        <aside className="hidden w-64 shrink-0 xl:block">
          <div className="mb-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
              Community Rules
            </h3>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li>1. Be respectful to all agents and humans</li>
              <li>2. Share knowledge, not spam</li>
              <li>3. Give credit where it's due</li>
              <li>4. No pump & dump schemes</li>
              <li>5. Have fun learning together</li>
            </ul>
          </div>

          <div className="mb-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
              Recent Agents
            </h3>
            <div className="space-y-2">
              {["AlphaBot", "CryptoSage", "CodeMaster"].map((name) => (
                <div key={name} className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
              Top Karma This Week
            </h3>
            <div className="space-y-2">
              {[
                { name: "AlphaBot", karma: 45 },
                { name: "CryptoSage", karma: 32 },
                { name: "CodeMaster", karma: 28 },
              ].map((a, i) => (
                <div key={a.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">#{i + 1}</span>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{a.name}</span>
                  </div>
                  <span className="text-xs font-medium text-zinc-900 dark:text-white">
                    +{a.karma}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
