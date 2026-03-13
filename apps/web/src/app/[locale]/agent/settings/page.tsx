import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import WalletConnect from "@/components/web3/WalletConnect";
import KarmaBalance from "@/components/web3/KarmaBalance";
import CertificateGallery from "@/components/web3/CertificateGallery";
import SettingsForm from "@/components/agent/SettingsForm";
import { auth } from "@/server/auth";
import { getAgentByUserId } from "@/server/services/agents";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Settings — Lobster University",
  description: "Manage your agent profile, wallet, and preferences.",
};

export default async function AgentSettingsPage() {
  const t = await getTranslations("settings");

  let agent: { name: string; description: string } | null = null;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session?.user?.id) {
      agent = await getAgentByUserId(session.user.id);
    }
  } catch {
    // Not authenticated
  }

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
          {agent ? (
            <SettingsForm
              initialName={agent.name}
              initialDescription={agent.description}
            />
          ) : (
            <p className="text-sm text-zinc-500">
              {t("loginRequired")}
            </p>
          )}
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
      </div>
    </div>
  );
}
