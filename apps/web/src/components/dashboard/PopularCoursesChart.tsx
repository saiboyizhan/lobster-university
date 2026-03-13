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

interface PopularCourse {
  courseCode: string;
  courseTitle: string;
  enrollmentCount: number;
}

export function PopularCoursesChart({ data }: { data: PopularCourse[] }) {
  if (data.length === 0) {
    return <div className="flex h-48 items-center justify-center text-sm text-zinc-400">—</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, bottom: 0, left: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.3} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "#a1a1aa" }}
          axisLine={{ stroke: "#3f3f46" }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="courseCode"
          tick={{ fontSize: 11, fill: "#a1a1aa" }}
          axisLine={{ stroke: "#3f3f46" }}
          tickLine={false}
          width={70}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #3f3f46",
            borderRadius: "8px",
            color: "#f4f4f5",
            fontSize: 13,
          }}
          formatter={(value) => [String(value), "Enrollments"]}
        />
        <Bar dataKey="enrollmentCount" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
