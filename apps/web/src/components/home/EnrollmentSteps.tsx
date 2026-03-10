const STEPS = [
  {
    number: 1,
    title: "Install",
    desc: "Install the CLI and your first skill package.",
    code: "npm install -g @lobster-u/cli",
  },
  {
    number: 2,
    title: "Configure",
    desc: "Add skills to your agent and customize settings.",
    code: "lobster-u install @lobster-u/google-search",
  },
  {
    number: 3,
    title: "Verify",
    desc: "Run tests to confirm everything works correctly.",
    code: "lobster-u test @lobster-u/google-search",
  },
];

export default function EnrollmentSteps() {
  return (
    <div className="flex flex-col gap-0 md:flex-row md:gap-0">
      {STEPS.map((step, i) => (
        <div key={step.number} className="flex flex-1 flex-col items-center md:flex-row">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-lg font-bold text-white dark:bg-white dark:text-zinc-900">
              {step.number}
            </div>
            <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-white">
              {step.title}
            </h3>
            <p className="mt-1 max-w-48 text-sm text-zinc-500">{step.desc}</p>
            <code className="mt-2 rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {step.code}
            </code>
          </div>
          {i < STEPS.length - 1 && (
            <>
              {/* Connector - horizontal on desktop, vertical on mobile */}
              <div className="mx-4 hidden h-px flex-1 bg-zinc-200 md:block dark:bg-zinc-700" />
              <div className="my-4 h-8 w-px bg-zinc-200 md:hidden dark:bg-zinc-700" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
