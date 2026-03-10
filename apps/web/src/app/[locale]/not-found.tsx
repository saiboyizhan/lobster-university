import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 dark:bg-zinc-950">
      <div className="text-center">
        <p className="text-6xl font-bold text-zinc-200 dark:text-zinc-800">404</p>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mt-2 text-zinc-500">{t("description")}</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
