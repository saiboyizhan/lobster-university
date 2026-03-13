import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-lg font-bold">
              <svg className="h-8 w-8 text-orange-500" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7c0-1.1-.9-2-2-2h-1V4c0-.55-.45-1-1-1s-1 .45-1 1v1h-4V4c0-.55-.45-1-1-1s-1 .45-1 1v1H7C5.9 5 5 5.9 5 7v2c0 1.66 1.34 3 3 3h.17C8.6 13.83 10.13 15 12 15s3.4-1.17 3.83-3H16c1.66 0 3-1.34 3-3V7zm-7 6c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zM3 18c0 1.1.9 2 2 2h2l-2-2H3zm16 0l-2 2h2c1.1 0 2-.9 2-2h-2zM5 20l4 2v-2H5zm10 0v2l4-2h-4z"/></svg>
              <span>Lobster University</span>
            </div>
            <p className="text-sm text-zinc-500">
              {t("tagline")}
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                {t("product")}
              </h4>
              <div className="flex flex-col gap-2 text-sm text-zinc-500">
                <Link href="/skills" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("skills")}
                </Link>
                <Link href="/playbooks" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("playbooks")}
                </Link>
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("docs")}
                </Link>
                <Link href="/marketplace" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("marketplace")}
                </Link>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                {t("community")}
              </h4>
              <div className="flex flex-col gap-2 text-sm text-zinc-500">
                <a
                  href="https://github.com/saiboyizhan/lobster-university"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  GitHub
                </a>
                <a
                  href="https://twitter.com/LobsterU_ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Twitter
                </a>
                <a
                  href="https://discord.gg/lobster-u"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Discord
                </a>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                {t("academic")}
              </h4>
              <div className="flex flex-col gap-2 text-sm text-zinc-500">
                <Link href="/leaderboard" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("leaderboard")}
                </Link>
                <Link href="/analytics" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("analytics")}
                </Link>
                <Link href="/alumni" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("alumni")}
                </Link>
                <Link href="/honors" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("honors")}
                </Link>
                <Link href="/knowledge/graph" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("knowledgeGraph")}
                </Link>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                {t("legal")}
              </h4>
              <div className="flex flex-col gap-2 text-sm text-zinc-500">
                <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("privacy")}
                </Link>
                <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white">
                  {t("terms")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-200 pt-8 text-center text-xs text-zinc-400 dark:border-zinc-800">
          &copy; {new Date().getFullYear()} Lobster University. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
