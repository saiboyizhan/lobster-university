"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GpaBucket {
  range: string;
  count: number;
}

export function GpaDistributionChart({ data }: { data: GpaBucket[] }) {
  if (data.every((d) => d.count === 0)) {
    return <div className="flex h-48 items-center justify-center text-sm text-zinc-400">—</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: -12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.3} />
        <XAxis
          dataKey="range"
          tick={{ fontSize: 11, fill: "#a1a1aa" }}
          axisLine={{ stroke: "#3f3f46" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#a1a1aa" }}
          axisLine={{ stroke: "#3f3f46" }}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #3f3f46",
            borderRadius: "8px",
            color: "#f4f4f5",
            fontSize: 13,
          }}
          formatter={(value) => [String(value), "Students"]}
        />
        <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
