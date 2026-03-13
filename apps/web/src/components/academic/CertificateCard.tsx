import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface Props {
  id: string;
  type: string;
  title: string;
  grade?: string | null;
  courseCode?: string | null;
  degreeName?: string | null;
  issuedAt: Date;
  txHash?: string | null;
}

export default function CertificateCard({
  id,
  type,
  title,
  grade,
  courseCode,
  degreeName,
  issuedAt,
  txHash,
}: Props) {
  const t = useTranslations("certificates");
  const tDetail = useTranslations("certificateDetail");
  const iconSvg = type === "degree"
    ? <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 0 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a23.838 23.838 0 0 0-1.012 5.434c0 .03.005.06.01.09a49.39 49.39 0 0 1 8.744 4.033 49.393 49.393 0 0 1 8.745-4.032c.004-.031.01-.062.01-.091a23.836 23.836 0 0 0-1.012-5.434m-15.485 0A23.94 23.94 0 0 1 12 3.197a23.94 23.94 0 0 0 7.74 6.95M12 3.197V1.5m0 1.697a23.94 23.94 0 0 0-7.74 6.95" /></svg>
    : type === "honor"
      ? <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.77.896m5.25-6.86V2.721" /></svg>
      : <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>;
  const typeLabel =
    type === "course_completion"
      ? t("courseCompletion")
      : type === "degree"
        ? t("degree")
        : t("honor");

  return (
    <Link
      href={`/certificates/${id}`}
      className="group flex items-start gap-4 rounded-xl border border-zinc-200 p-4 transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-600"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
        {iconSvg}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <h3 className="truncate font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {title}
          </h3>
          {txHash && (
            <span className="shrink-0 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
              {t("onChain")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>{typeLabel}</span>
          {courseCode && <span>· {courseCode}</span>}
          {degreeName && <span>· {degreeName}</span>}
          {grade && <span>· {tDetail("grade")}: {grade}</span>}
          <span>· {issuedAt.toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
