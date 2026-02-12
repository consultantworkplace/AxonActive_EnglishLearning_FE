"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import type { SkillId } from "@/lib/types";
import { MissionCard } from "@/components/MissionCard";
import { MissionFilters } from "@/components/MissionFilters";

export default function MissionsPage() {
  const { missionTemplates, actions } = useAppStore();
  const [selectedSkill, setSelectedSkill] = useState<SkillId | "all">("all");
  const [maxMinutes, setMaxMinutes] = useState<number>(20);
  const [lastCompletedTitle, setLastCompletedTitle] = useState<string | null>(
    null
  );

  const filtered = useMemo(
    () =>
      missionTemplates.filter((m) => {
        if (selectedSkill !== "all" && m.skillId !== selectedSkill) return false;
        if (m.estMinutes > maxMinutes) return false;
        return true;
      }),
    [missionTemplates, selectedSkill, maxMinutes]
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Missions
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600">
          Choose one small, well-defined mission. Finish it with full focus to
          earn XP and extend your streak. No multitasking, no half-work.
        </p>
      </header>

      <MissionFilters
        selectedSkill={selectedSkill}
        onSkillChange={setSelectedSkill}
        maxMinutes={maxMinutes}
        onMaxMinutesChange={setMaxMinutes}
      />

      {lastCompletedTitle && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          Completed: <span className="font-semibold">{lastCompletedTitle}</span>
          . XP and streak updated in your dashboard.
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onComplete={() => {
              actions.completeMission(mission.id);
              setLastCompletedTitle(mission.title);
            }}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-zinc-500">
            No missions match this filter. Try increasing the max duration or
            switching skill.
          </p>
        )}
      </section>
    </div>
  );
}

