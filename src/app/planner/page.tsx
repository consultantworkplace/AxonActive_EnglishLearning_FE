"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import type { SkillId } from "@/lib/types";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { addDaysYmd, todayYmd, weekStartMondayYmd } from "@/lib/date";
import { ProgressBar } from "@/components/ProgressBar";
import { skillLabel } from "@/lib/utils";

const dayShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PlannerPage() {
  const { logs, weeklyPlan, missionTemplates, actions } = useAppStore();
  const [target, setTarget] = useState<number>(weeklyPlan.xpTarget);
  const [focus, setFocus] = useState<Record<SkillId, number>>(
    weeklyPlan.skillFocusPercentages
  );

  const weekStart = weekStartMondayYmd(todayYmd());
  const days = useMemo(() => {
    const arr: { date: string; label: string; isToday: boolean; xpEarned: number }[] =
      [];
    const today = todayYmd();
    for (let i = 0; i < 7; i++) {
      const date = addDaysYmd(weekStart, i);
      const xpEarned = logs
        .filter((l) => l.date === date)
        .reduce((sum, l) => sum + l.xpEarned, 0);
      arr.push({
        date,
        label: dayShort[i],
        isToday: date === today,
        xpEarned,
      });
    }
    return arr;
  }, [logs, weekStart]);

  const suggestions = useMemo(() => {
    const result: Array<{
      skillId: SkillId;
      missions: { id: string; title: string; xp: number; estMinutes: number }[];
    }> = [];
    (["reading", "listening", "speaking", "writing", "vocabulary"] as SkillId[]).forEach(
      (skillId) => {
        if (focus[skillId] <= 0) return;
        const mts = missionTemplates
          .filter((m) => m.skillId === skillId)
          .slice(0, 2);
        if (mts.length) {
          result.push({
            skillId,
            missions: mts.map((m) => ({
              id: m.id,
              title: m.title,
              xp: m.xp,
              estMinutes: m.estMinutes,
            })),
          });
        }
      }
    );
    return result;
  }, [missionTemplates, focus]);

  const totalFocus = Object.values(focus).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Weekly planner
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600">
          Decide your XP target and skill focus for this week. The goal is a
          realistic, sustainable system, not perfection on a single day.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm md:col-span-1">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Weekly XP target
          </div>
          <div className="flex items-baseline gap-2">
            <input
              type="number"
              className="w-24 rounded-md border border-zinc-300 px-2 py-1 text-sm"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value) || 0)}
              min={0}
              step={50}
            />
            <span className="text-xs text-zinc-600">XP</span>
          </div>
          <button
            type="button"
            onClick={() => {
              actions.setWeeklyTarget(target);
            }}
            className="inline-flex items-center justify-center rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600"
          >
            Save target
          </button>
          <p className="text-[11px] text-zinc-500">
            Use Parkinson&apos;s law: slightly tight but believable deadlines
            increase focus without burning you out.
          </p>
        </section>

        <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Skill focus split
              </div>
              <p className="mt-1 text-xs text-zinc-600">
                Adjust the percentage of XP you want to invest in each skill.
              </p>
            </div>
            <div className="text-xs text-zinc-500">
              Total: {totalFocus}% (does not need to be exactly 100%)
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            {(["reading", "listening", "speaking", "writing", "vocabulary"] as SkillId[]).map(
              (id) => (
                <div key={id} className="flex items-center gap-3 text-xs">
                  <div className="w-24 text-zinc-700">{skillLabel(id)}</div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    step={5}
                    value={focus[id]}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setFocus((prev) => ({ ...prev, [id]: value }));
                      actions.setSkillFocus({ [id]: value });
                    }}
                    className="flex-1"
                  />
                  <div className="w-10 text-right tabular-nums">
                    {focus[id]}%
                  </div>
                </div>
              )
            )}
          </div>
          <div className="mt-2">
            <ProgressBar value={totalFocus} max={100} />
          </div>
        </section>
      </section>

      <WeeklyCalendar
        days={days}
        footer={
          <>
            Aim to have at least a small block (10–20 XP) on most days. Empty
            days are fine occasionally; the danger is letting them chain.
          </>
        }
      />

      <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Suggested missions
            </div>
            <p className="mt-1 text-xs text-zinc-600">
              Based on your focus split, here are 1–2 micro-missions per skill
              you can schedule into your calendar.
            </p>
          </div>
        </div>
        <div className="mt-2 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((group) => (
            <div
              key={group.skillId}
              className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs"
            >
              <div className="font-semibold text-zinc-800">
                {skillLabel(group.skillId)} ({focus[group.skillId]}%)
              </div>
              {group.missions.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-col rounded-md border border-zinc-200 bg-white px-2 py-1"
                >
                  <div className="font-medium text-zinc-800">{m.title}</div>
                  <div className="mt-0.5 text-[11px] text-zinc-500">
                    {m.xp} XP · {m.estMinutes} min
                  </div>
                </div>
              ))}
            </div>
          ))}
          {suggestions.length === 0 && (
            <p className="text-xs text-zinc-500">
              Increase at least one skill&apos;s focus above 0% to see suggested
              missions.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

