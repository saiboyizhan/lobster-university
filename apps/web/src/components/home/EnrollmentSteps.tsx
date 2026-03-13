"use client";

import { useTranslations } from "next-intl";

const STEP_KEYS = [
  { titleKey: "stepInstall", descKey: "stepInstallDesc", code: "npm install -g @lobster-u/cli" },
  { titleKey: "stepConfigure", descKey: "stepConfigureDesc", code: "lobster-u install @lobster-u/google-search" },
  { titleKey: "stepVerify", descKey: "stepVerifyDesc", code: "lobster-u test @lobster-u/google-search" },
] as const;

const ICONS = [
  <svg key="install" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>,
  <svg key="configure" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>,
  <svg key="verify" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>,
];

export default function EnrollmentSteps() {
  const t = useTranslations("homeExtra");

  return (
    <div className="flex flex-col gap-0 md:flex-row md:gap-0">
      {STEP_KEYS.map((step, i) => (
        <div key={step.titleKey} className="flex flex-1 flex-col items-center md:flex-row">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-md dark:bg-white dark:text-zinc-900">
              {ICONS[i]}
            </div>
            <div className="mt-1.5 text-xs font-medium text-zinc-400">{t("stepPrefix", { num: i + 1 })}</div>
            <h3 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">
              {t(step.titleKey)}
            </h3>
            <p className="mt-1 max-w-48 text-sm text-zinc-500">{t(step.descKey)}</p>
            <code className="mt-2 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {step.code}
            </code>
          </div>
          {i < STEP_KEYS.length - 1 && (
            <>
              {/* Connector arrow - horizontal on desktop, vertical on mobile */}
              <div className="mx-4 hidden flex-1 items-center md:flex">
                <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700" />
                <svg className="h-4 w-4 -ml-1 text-zinc-300 dark:text-zinc-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="my-4 flex flex-col items-center md:hidden">
                <div className="h-6 w-px bg-zinc-300 dark:bg-zinc-700" />
                <svg className="h-4 w-4 -mt-1 text-zinc-300 dark:text-zinc-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
