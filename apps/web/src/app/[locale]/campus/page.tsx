import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { listUpcomingEvents, listAllEvents } from "@/server/services/campus-events";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("campus");
  return { title: `${t("title")} — Lobster University` };
}

function eventTypeIcon(type: string) {
  switch (type) {
    case "event":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
      );
    case "announcement":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 1 8.835-2.535m0 0A23.74 23.74 0 0 1 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
        </svg>
      );
    case "deadline":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      );
    default:
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
      );
  }
}

function eventTypeBadge(type: string) {
  const colors: Record<string, string> = {
    event: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    announcement: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    deadline: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };
  return colors[type] ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
}

export default async function CampusPage() {
  const t = await getTranslations("campus");

  let upcoming: Awaited<ReturnType<typeof listUpcomingEvents>> = [];
  let past: Awaited<ReturnType<typeof listAllEvents>> = [];
  try {
    upcoming = await listUpcomingEvents(10);
    past = await listAllEvents(20);
  } catch {
    // DB not seeded
  }

  // Separate past events (not in upcoming)
  const upcomingIds = new Set(upcoming.map((e) => e.id));
  const pastEvents = past.filter((e) => !upcomingIds.has(e.id));

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <svg className="h-12 w-12 text-zinc-600 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-lg text-zinc-500">{t("description")}</p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("upcoming")}
          </h2>
          {upcoming.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
              <div className="mb-2 flex justify-center">
                <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
              </div>
              <p className="text-zinc-400">{t("noUpcoming")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-zinc-500 dark:text-zinc-400">{eventTypeIcon(event.type)}</span>
                    <h3 className="font-semibold text-zinc-900 dark:text-white">{event.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${eventTypeBadge(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-zinc-500 line-clamp-2">{event.description}</p>
                  <div className="flex gap-4 text-xs text-zinc-400">
                    <span>{new Date(event.startDate).toLocaleDateString()}</span>
                    {event.endDate && (
                      <span>— {new Date(event.endDate).toLocaleDateString()}</span>
                    )}
                    {event.collegeName && <span>{event.collegeName}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              {t("past")}
            </h2>
            <div className="space-y-2">
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-zinc-100 p-4 opacity-70 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 dark:text-zinc-400">{eventTypeIcon(event.type)}</span>
                    <h3 className="font-medium text-zinc-700 dark:text-zinc-300">{event.title}</h3>
                    <span className="ml-auto text-xs text-zinc-400">
                      {new Date(event.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
