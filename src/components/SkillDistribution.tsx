import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import type { SkillId } from "@/lib/types";
import { skillLabel } from "@/lib/utils";

const COLORS: Record<SkillId, string> = {
  reading: "#0f172a",
  listening: "#2563eb",
  speaking: "#1d4ed8",
  writing: "#4b5563",
  vocabulary: "#9ca3af",
};

type Props = {
  distribution: Record<SkillId, number>;
};

export function SkillDistribution({ distribution }: Props) {
  const data = (Object.keys(distribution) as SkillId[]).map((id) => ({
    id,
    name: skillLabel(id),
    value: distribution[id],
  }));

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        Skill balance (last 7 days)
      </div>
      <div className="flex items-center gap-4">
        <div className="h-40 w-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.id} fill={COLORS[entry.id]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-1 flex-col gap-1 text-xs text-zinc-600">
          {data.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLORS[entry.id] }}
                />
                <span>{entry.name}</span>
              </div>
              <span className="tabular-nums">
                {Math.round(entry.value).toString().padStart(2, "0")}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

