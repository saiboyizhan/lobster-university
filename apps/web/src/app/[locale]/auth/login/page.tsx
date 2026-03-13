import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DevLoginForm } from "./DevLoginForm";

export const metadata: Metadata = {
  title: "Login — Lobster University",
};

export default function LoginPage() {
  const t = useTranslations("login");
  const ta = useTranslations("auth");

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <svg className="h-12 w-12 text-orange-500" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7c0-1.1-.9-2-2-2h-1V4c0-.55-.45-1-1-1s-1 .45-1 1v1h-4V4c0-.55-.45-1-1-1s-1 .45-1 1v1H7C5.9 5 5 5.9 5 7v2c0 1.66 1.34 3 3 3h.17C8.6 13.83 10.13 15 12 15s3.4-1.17 3.83-3H16c1.66 0 3-1.34 3-3V7zm-7 6c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zM3 18c0 1.1.9 2 2 2h2l-2-2H3zm16 0l-2 2h2c1.1 0 2-.9 2-2h-2zM5 20l4 2v-2H5zm10 0v2l4-2h-4z"/></svg>
          </div>
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

        {/* Dev-only login (hidden in production) */}
        <DevLoginForm />

        <p className="mt-4 text-center text-sm text-zinc-500">
          {ta("noAccount")}{" "}
          <Link
            href="/auth/register"
            className="font-medium text-zinc-900 hover:underline dark:text-white"
          >
            {ta("signUp")}
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-zinc-400">
          {t("legalNotice")}
        </p>
      </div>
    </div>
  );
}
