import type { SkillId } from "@/lib/types";
import { skillLabel } from "@/lib/utils";

type Props = {
  selectedSkill: SkillId | "all";
  onSkillChange: (skill: SkillId | "all") => void;
  maxMinutes: number;
  onMaxMinutesChange: (minutes: number) => void;
};

export function MissionFilters({
  selectedSkill,
  onSkillChange,
  maxMinutes,
  onMaxMinutesChange,
}: Props) {
  const skills: Array<{ id: SkillId | "all"; label: string }> = [
    { id: "all", label: "All skills" },
    { id: "reading", label: skillLabel("reading") },
    { id: "listening", label: skillLabel("listening") },
    { id: "speaking", label: skillLabel("speaking") },
    { id: "writing", label: skillLabel("writing") },
    { id: "vocabulary", label: skillLabel("vocabulary") },
  ];

  return (
    <section className="flex flex-wrap items-end gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-1 text-xs">
        <label className="font-medium text-zinc-600">Skill</label>
        <select
          className="h-8 rounded-md border border-zinc-300 bg-white px-2 text-xs text-zinc-800"
          value={selectedSkill}
          onChange={(e) => onSkillChange(e.target.value as SkillId | "all")}
        >
          {skills.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 text-xs">
        <label className="font-medium text-zinc-600">
          Max duration ({maxMinutes} min)
        </label>
        <input
          type="range"
          min={5}
          max={30}
          step={5}
          value={maxMinutes}
          onChange={(e) => onMaxMinutesChange(Number(e.target.value))}
        />
      </div>

      <p className="ml-auto max-w-xs text-[11px] text-zinc-500">
        Pick one mission that fits your current time block and focus. Complete
        it fully, then log off or take a deliberate break.
      </p>
    </section>
  );
}

