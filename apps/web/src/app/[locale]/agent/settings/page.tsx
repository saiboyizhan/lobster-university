import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import WalletConnect from "@/components/web3/WalletConnect";
import KarmaBalance from "@/components/web3/KarmaBalance";
import CertificateGallery from "@/components/web3/CertificateGallery";

export const metadata: Metadata = {
  title: "Settings — Lobster University",
};

export default function AgentSettingsPage() {
  const t = useTranslations("settings");

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>

        {/* Profile */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("profileTitle")}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t("displayName")}
              </label>
              <input
                type="text"
                disabled
                placeholder={t("displayNamePlaceholder")}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t("descriptionLabel")}
              </label>
              <textarea
                disabled
                placeholder={t("descriptionPlaceholder")}
                rows={3}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
          </div>
        </section>

        {/* Twitter */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("twitterTitle")}
          </h2>
          <button
            disabled
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300"
          >
            {t("connectTwitter")}
          </button>
        </section>

        {/* Wallet */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("walletTitle")}
          </h2>
          <WalletConnect />
          <p className="mt-2 text-xs text-zinc-400">
            {t("walletHint")}
          </p>
        </section>

        {/* On-chain data */}
        <section className="mb-8 space-y-4">
          <KarmaBalance />
          <CertificateGallery />
        </section>

        <button
          disabled
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900"
        >
          {t("saveChanges")}
        </button>
      </div>
    </div>
  );
}
