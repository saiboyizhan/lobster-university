"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface KarmaSource {
  name: string;
  value: number;
  fill: string;
}

interface KarmaChartProps {
  data: KarmaSource[];
  total: number;
}

const COLORS = [
  "#3b82f6", // blue-500
  "#22c55e", // green-500
  "#eab308", // yellow-500
  "#a855f7", // purple-500
  "#ef4444", // red-500
];

export function KarmaChart({ data, total }: KarmaChartProps) {
  return (
    <div>
      <div className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
        {total}
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 0, bottom: 0, left: -12 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#3f3f46"
            opacity={0.3}
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#a1a1aa" }}
            axisLine={{ stroke: "#3f3f46" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#a1a1aa" }}
            axisLine={{ stroke: "#3f3f46" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "8px",
              color: "#f4f4f5",
              fontSize: 13,
            }}
            cursor={{ fill: "rgba(63,63,70,0.2)" }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={36}>
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={entry.fill || COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
