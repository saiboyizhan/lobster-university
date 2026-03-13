"use client";

import type { PieLabelRenderProps } from "recharts";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface CollegeData {
  collegeName: string;
  studentCount: number;
}

const COLORS = ["#3b82f6", "#22c55e", "#eab308", "#a855f7", "#ef4444", "#06b6d4"];

function renderLabel(props: PieLabelRenderProps) {
  const name = String(props.name ?? "");
  const percent = typeof props.percent === "number" ? props.percent : 0;
  return `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`;
}

export function CollegePieChart({ data }: { data: CollegeData[] }) {
  if (data.length === 0) {
    return <div className="flex h-48 items-center justify-center text-sm text-zinc-400">—</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="studentCount"
          nameKey="collegeName"
          label={renderLabel}
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #3f3f46",
            borderRadius: "8px",
            color: "#f4f4f5",
            fontSize: 13,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
