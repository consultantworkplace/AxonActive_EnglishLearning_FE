import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { SkillId } from "@/lib/types";
import { skillLabel } from "@/lib/utils";

type Props = {
  distribution: Record<SkillId, number>;
};

export function SkillRadar({ distribution }: Props) {
  const data = (Object.keys(distribution) as SkillId[]).map((id) => ({
    skill: skillLabel(id),
    value: Math.round(distribution[id]),
  }));

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        Skill balance radar
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis tick={{ fontSize: 8 }} />
            <Radar
              name="Last 7 days"
              dataKey="value"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.25}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

