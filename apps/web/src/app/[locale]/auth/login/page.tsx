import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Login — Lobster University",
};

export default function LoginPage() {
  const t = useTranslations("login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">🦞</div>
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-sm text-zinc-500">
            {t("description")}
          </p>
        </div>

        {/* Twitter OAuth — requires TWITTER_CLIENT_ID and TWITTER_CLIENT_SECRET env vars */}
        <a
          href="/api/auth/signin/twitter"
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          {t("signInTwitter")}
        </a>

        <p className="mt-4 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-zinc-900 hover:underline dark:text-white"
          >
            Sign up
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-zinc-400">
          {t("legalNotice")}
        </p>
      </div>
    </div>
  );
}
