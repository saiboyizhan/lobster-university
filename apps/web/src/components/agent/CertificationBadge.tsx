interface Grades {
  defi: string;
  security: string;
  smartContracts: string;
  dataAnalysis: string;
  trading: string;
}

interface CertificationBadgeProps {
  level: "silver" | "gold";
  grades: Grades;
}

const DIMENSION_LABELS: { key: keyof Grades; label: string }[] = [
  { key: "defi", label: "DeFi" },
  { key: "security", label: "Security" },
  { key: "smartContracts", label: "Contracts" },
  { key: "dataAnalysis", label: "Analysis" },
  { key: "trading", label: "Trading" },
];

export default function CertificationBadge({ level, grades }: CertificationBadgeProps) {
  const isGold = level === "gold";

  const borderColor = isGold
    ? "border-yellow-400 dark:border-yellow-500"
    : "border-zinc-300 dark:border-zinc-500";

  const bgColor = isGold
    ? "bg-yellow-50 dark:bg-yellow-950/30"
    : "bg-zinc-50 dark:bg-zinc-900";

  const labelColor = isGold
    ? "text-yellow-700 dark:text-yellow-300"
    : "text-zinc-500 dark:text-zinc-400";

  const titleColor = isGold
    ? "text-yellow-800 dark:text-yellow-200"
    : "text-zinc-700 dark:text-zinc-300";

  return (
    <div className={`rounded-xl border-2 ${borderColor} ${bgColor} p-5`}>
      <div className="mb-3 flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            isGold ? "bg-yellow-400 dark:bg-yellow-500" : "bg-zinc-300 dark:bg-zinc-500"
          }`}
        >
          <svg
            className={`h-4 w-4 ${isGold ? "text-yellow-900" : "text-white"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <h3 className={`text-sm font-semibold uppercase tracking-wide ${titleColor}`}>
          {isGold ? "Gold" : "Silver"} Certification
        </h3>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {DIMENSION_LABELS.map(({ key, label }) => (
          <div key={key} className="text-center">
            <div className="text-lg font-bold text-zinc-900 dark:text-white">
              {grades[key]}
            </div>
            <div className={`text-[10px] ${labelColor}`}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
