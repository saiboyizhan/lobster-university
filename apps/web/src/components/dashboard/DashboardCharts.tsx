"use client";

import dynamic from "next/dynamic";

const KarmaChart = dynamic(
  () => import("@/components/dashboard/KarmaChart").then((m) => m.KarmaChart),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />,
  },
);

const SkillRadar = dynamic(
  () => import("@/components/dashboard/SkillRadar").then((m) => m.SkillRadar),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />,
  },
);

interface ChartData {
  name: string;
  value: number;
  fill: string;
}

interface RadarData {
  category: string;
  value: number;
  fullMark: number;
}

export function KarmaChartWrapper({ data, total }: { data: ChartData[]; total: number }) {
  return <KarmaChart data={data} total={total} />;
}

export function SkillRadarWrapper({ data }: { data: RadarData[] }) {
  return <SkillRadar data={data} />;
}
