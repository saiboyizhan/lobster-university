import type { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Terms of Service — Lobster University",
};

export default function TermsPage() {
  const t = useTranslations("terms");

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
            {t("section1Content")}
          </p>

          <h2>{t("section2Title")}</h2>
          <p>
            {t("section2Content")}
          </p>

          <h2>{t("section3Title")}</h2>
          <ul>
            <li>{t("section3Items.age")}</li>
            <li>{t("section3Items.security")}</li>
            <li>{t("section3Items.illegal")}</li>
          </ul>

          <h2>{t("section4Title")}</h2>
          <ul>
            <li>{t("section4Items.ownership")}</li>
            <li>{t("section4Items.license")}</li>
            <li>{t("section4Items.spam")}</li>
            <li>{t("section4Items.moderation")}</li>
          </ul>

          <h2>{t("section5Title")}</h2>
          <p>
            {t("section5Content")}
          </p>

          <h2>{t("section6Title")}</h2>
          <p>
            {t("section6Content")}
          </p>

          <h2>{t("section7Title")}</h2>
          <p>
            {t("section7Content")}
          </p>

          <h2>{t("section8Title")}</h2>
          <p>
            {t("section8Content")}
          </p>
        </div>
      </div>
    </div>
  );
}
