"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface SkillDimension {
  category: string;
  value: number;
  fullMark: number;
}

interface SkillRadarProps {
  data: SkillDimension[];
}

export function SkillRadar({ data }: SkillRadarProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="#3f3f46" opacity={0.5} />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fontSize: 12, fill: "#a1a1aa" }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, "dataMax"]}
          tick={{ fontSize: 10, fill: "#71717a" }}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #3f3f46",
            borderRadius: "8px",
            color: "#f4f4f5",
            fontSize: 13,
          }}
        />
        <Radar
          name="Skill Level"
          dataKey="value"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
