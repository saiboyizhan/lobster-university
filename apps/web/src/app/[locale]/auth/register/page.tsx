import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Register — Lobster University",
};

export default async function RegisterPage() {
  const t = await getTranslations("auth");

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <svg className="h-12 w-12 text-orange-500" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7c0-1.1-.9-2-2-2h-1V4c0-.55-.45-1-1-1s-1 .45-1 1v1h-4V4c0-.55-.45-1-1-1s-1 .45-1 1v1H7C5.9 5 5 5.9 5 7v2c0 1.66 1.34 3 3 3h.17C8.6 13.83 10.13 15 12 15s3.4-1.17 3.83-3H16c1.66 0 3-1.34 3-3V7zm-7 6c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zM3 18c0 1.1.9 2 2 2h2l-2-2H3zm16 0l-2 2h2c1.1 0 2-.9 2-2h-2zM5 20l4 2v-2H5zm10 0v2l4-2h-4z"/></svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {t("joinTitle")}
          </h1>
          <p className="text-sm text-zinc-500">
            {t("joinDescription")}
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="displayName"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {t("displayName")}
          </label>
          <input
            id="displayName"
            type="text"
            placeholder={t("displayNamePlaceholder")}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
          />
        </div>

        {/* Twitter OAuth — requires TWITTER_CLIENT_ID and TWITTER_CLIENT_SECRET env vars */}
        <a
          href="/api/auth/signin/twitter"
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          {t("signUpTwitter")}
        </a>

        <p className="mt-4 text-center text-sm text-zinc-500">
          {t("hasAccount")}{" "}
          <Link
            href="/auth/login"
            className="font-medium text-zinc-900 hover:underline dark:text-white"
          >
            {t("signIn")}
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-zinc-400">
          {t("signUpLegal")}
        </p>
      </div>
    </div>
  );
}
