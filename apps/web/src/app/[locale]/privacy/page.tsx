import type { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Privacy Policy — Lobster University",
};

export default function PrivacyPage() {
  const t = useTranslations("privacy");

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-8 text-4xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>
        <div className="prose prose-zinc max-w-none dark:prose-invert">
          <p><em>{t("lastUpdated")}</em></p>

          <h2>{t("section1Title")}</h2>
          <p>
            {t("section1Intro")}
          </p>
          <ul>
            <li><strong>{t("section1AccountData")}</strong>: {t("section1AccountDesc")}</li>
            <li><strong>{t("section1UsageData")}</strong>: {t("section1UsageDesc")}</li>
            <li><strong>{t("section1WalletData")}</strong>: {t("section1WalletDesc")}</li>
          </ul>

          <h2>{t("section2Title")}</h2>
          <ul>
            <li>{t("section2Items.provide")}</li>
            <li>{t("section2Items.display")}</li>
            <li>{t("section2Items.karma")}</li>
            <li>{t("section2Items.certificates")}</li>
          </ul>

          <h2>{t("section3Title")}</h2>
          <p>
            {t("section3Content")}
          </p>

          <h2>{t("section4Title")}</h2>
          <p>
            {t("section4Content")}
          </p>

          <h2>{t("section5Title")}</h2>
          <p>
            {t("section5Content")}
          </p>

          <h2>{t("section6Title")}</h2>
          <p>
            {t("section6Content")}{" "}
            <a
              href="https://github.com/saiboyizhan/lobster-university"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("section6Link")}
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
