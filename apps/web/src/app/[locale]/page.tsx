import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import CodeBlock from "@/components/ui/CodeBlock";
import EnrollmentSteps from "@/components/home/EnrollmentSteps";
import ProductCards from "@/components/home/ProductCards";
import EmailSubscribe from "@/components/home/EmailSubscribe";

const SKILL_CATEGORIES = [
  {
    titleKey: "catInfoRetrieval",
    count: 5,
    skills: ["google-search", "academic-search", "rss-manager", "twitter-intel", "reddit-tracker"],
    color: "bg-blue-500",
  },
  {
    titleKey: "catContentProcessing",
    count: 5,
    skills: ["summarizer", "translator", "rewriter", "keyword-extractor", "sentiment-analyzer"],
    color: "bg-green-500",
  },
  {
    titleKey: "catCodeAssistance",
    count: 5,
    skills: ["code-gen", "code-review", "debugger", "refactor", "doc-gen"],
    color: "bg-purple-500",
  },
  {
    titleKey: "catCreativeGeneration",
    count: 6,
    skills: ["brainstorm", "storyteller", "writer", "copywriter", "social-media", "content-engine"],
    color: "bg-orange-500",
  },
  {
    titleKey: "catCryptoWeb3",
    count: 5,
    skills: ["chain-analyzer", "dex-trader", "token-launcher", "kol-manager", "wallet-monitor"],
    color: "bg-yellow-500",
  },
  {
    titleKey: "catSelfEvolution",
    count: 7,
    skills: ["mental-models", "assessment", "healthcheck", "selfoptimize", "certify", "reminder", "campus-sdk"],
    color: "bg-red-500",
  },
];

const FEATURES = [
  {
    titleKey: "featureCli",
    descKey: "featureCliDesc",
    icon: "terminal",
  },
  {
    titleKey: "featureOnChain",
    descKey: "featureOnChainDesc",
    icon: "chain",
  },
  {
    titleKey: "featureCampus",
    descKey: "featureCampusDesc",
    icon: "users",
  },
  {
    titleKey: "featureMarketplace",
    descKey: "featureMarketplaceDesc",
    icon: "store",
  },
  {
    titleKey: "featureAnalytics",
    descKey: "featureAnalyticsDesc",
    icon: "chart",
  },
  {
    titleKey: "featureMultiFramework",
    descKey: "featureMultiFrameworkDesc",
    icon: "plug",
  },
];

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  terminal: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
  chain: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>,
  users: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>,
  store: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" /></svg>,
  chart: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>,
  plug: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" /></svg>,
};

const QUICK_START_CODE = `# Install a skill
lobster-u install @lobster-u/google-search

# Install a combo
lobster-u install @lobster-u/code-gen @lobster-u/code-review

# Create your own skill
lobster-u create my-awesome-skill

# Run skill tests
lobster-u test @lobster-u/google-search`;

const SKILL_FORMAT_CODE = `@lobster-u/<skill-name>/
├── package.json          # npm package config
├── manifest.json         # metadata, tags, dependencies
├── SKILL.md              # role, triggers, capabilities
├── knowledge/            # domain knowledge
│   ├── domain.md
│   ├── best-practices.md
│   └── anti-patterns.md
├── strategies/           # behavioral strategies
│   └── main.md
└── tests/
    ├── smoke.json        # quick validation
    └── benchmark.json    # 10-task benchmark`;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");
  return {
    title: `${t("title")} — ${t("subtitle")}`,
    description: t("description"),
  };
}

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-14 text-center">
        {/* Gradient background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-orange-50/50 via-transparent to-transparent dark:from-orange-950/20" />
        <div className="pointer-events-none absolute top-20 -left-32 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-900/20" />
        <div className="pointer-events-none absolute top-40 -right-32 h-64 w-64 rounded-full bg-red-200/20 blur-3xl dark:bg-red-900/10" />

        <div className="relative">
          <div className="animate-float mb-4 flex justify-center">
            <svg className="h-16 w-16 text-orange-500" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7c0-1.1-.9-2-2-2h-1V4c0-.55-.45-1-1-1s-1 .45-1 1v1h-4V4c0-.55-.45-1-1-1s-1 .45-1 1v1H7C5.9 5 5 5.9 5 7v2c0 1.66 1.34 3 3 3h.17C8.6 13.83 10.13 15 12 15s3.4-1.17 3.83-3H16c1.66 0 3-1.34 3-3V7zm-7 6c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zM3 18c0 1.1.9 2 2 2h2l-2-2H3zm16 0l-2 2h2c1.1 0 2-.9 2-2h-2zM5 20l4 2v-2H5zm10 0v2l4-2h-4z"/></svg>
          </div>
          <h1 className="animate-fade-in mb-3 max-w-3xl text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl dark:text-white">
            {t("title")}
          </h1>
          <p className="animate-fade-in delay-100 mb-1.5 text-xl font-medium text-zinc-600 dark:text-zinc-400">
            {t("subtitle")}
          </p>
          <p className="animate-fade-in delay-200 mb-6 max-w-xl text-lg text-zinc-500">
            {t("description")}
          </p>

          {/* Stats */}
          <div className="animate-fade-in delay-300 mb-8 grid grid-cols-4 gap-4">
            {[
              { value: "33", label: t("statSkills") },
              { value: "6", label: t("statColleges") },
              { value: "33", label: t("statCourses") },
              { value: "6", label: t("statDegrees") },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-0.5 rounded-xl border border-zinc-200 bg-white/50 px-5 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <span className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</span>
                <span className="text-xs text-zinc-500">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="animate-fade-in delay-400 flex items-center justify-center gap-4">
            <a
              href="#get-started"
              className="inline-flex min-w-[160px] items-center justify-center rounded-lg bg-zinc-900 px-8 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-zinc-700 hover:shadow-xl dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {t("getStarted")}
            </a>
            <a
              href="https://github.com/saiboyizhan/lobster-university"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-[160px] items-center justify-center rounded-lg border border-zinc-300 px-8 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              {t("viewGithub")}
            </a>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section id="get-started" className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-6 text-center text-3xl font-bold text-zinc-900 dark:text-white">
          {t("quickStart")}
        </h2>
        <CodeBlock code={QUICK_START_CODE} title="terminal" />
      </section>

      {/* Skills Overview */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-4 text-center text-3xl font-bold text-zinc-900 dark:text-white">
          {t("skillsLibrary")}
        </h2>
        <p className="mb-12 text-center text-zinc-500">
          {t("skillsDescription", { count: 33 })}
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_CATEGORIES.map((cat) => (
            <div
              key={cat.titleKey}
              className="rounded-xl border border-zinc-200 p-6 transition hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:hover:border-zinc-700"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${cat.color}`} />
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {t(cat.titleKey)}
                </h3>
                <span className="ml-auto text-sm text-zinc-400">{cat.count}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="mb-4 text-center text-3xl font-bold text-zinc-900 dark:text-white">
            {t("features")}
          </h2>
          <p className="mb-12 text-center text-zinc-500">
            {t("featuresDescription")}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.titleKey} className="group rounded-xl border border-zinc-200 p-6 transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700">
                <div className="mb-3 inline-flex rounded-lg bg-zinc-100 p-2.5 text-zinc-600 transition group-hover:bg-zinc-900 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-white dark:group-hover:text-zinc-900">
                  {FEATURE_ICONS[f.icon]}
                </div>
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">
                  {t(f.titleKey)}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500">{t(f.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment Steps */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="mb-4 text-center text-3xl font-bold text-zinc-900 dark:text-white">
          {t("enrollmentTitle")}
        </h2>
        <p className="mb-12 text-center text-zinc-500">
          {t("enrollmentDescription")}
        </p>
        <EnrollmentSteps />
      </section>

      {/* Product Cards */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-4 text-center text-3xl font-bold text-zinc-900 dark:text-white">
          {t("explore")}
        </h2>
        <p className="mb-8 text-center text-zinc-500">
          {t("exploreDescription")}
        </p>
        <ProductCards />
      </section>

      {/* Skill Package Format */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-6 text-center text-3xl font-bold text-zinc-900 dark:text-white">
          {t("skillFormat")}
        </h2>
        <CodeBlock code={SKILL_FORMAT_CODE} language="text" title="structure" />
      </section>

      {/* Email Subscribe */}
      <section className="border-t border-zinc-200 bg-zinc-50 px-6 py-16 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-xl">
          <EmailSubscribe />
        </div>
      </section>
    </div>
  );
}
