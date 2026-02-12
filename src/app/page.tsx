"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { levelTierFromXp, tierRange } from "@/lib/gamification";
import { StatsCard } from "@/components/StatsCard";
import { ProgressBar } from "@/components/ProgressBar";
import { StreakBadge } from "@/components/StreakBadge";
import { SkillDistribution } from "@/components/SkillDistribution";
import { addDaysYmd, todayYmd, weekStartMondayYmd } from "@/lib/date";

export default function Home() {
  const { user, weeklyPlan, derived, logs } = useAppStore();
  const tier = levelTierFromXp(derived.levelXpTotal);
  const range = tierRange(tier);
  const tierProgress = derived.levelXpTotal - range.min;
  const tierMax = range.max - range.min;

  const weeklyPct =
    weeklyPlan.xpTarget > 0
      ? Math.min(100, (derived.weeklyXpEarned / weeklyPlan.xpTarget) * 100)
      : 0;

  const weekStart = weekStartMondayYmd(todayYmd());
  const weekDays = useMemo(() => {
    const arr: { label: string; date: string; hasXp: boolean }[] = [];
    const names = ["M", "T", "W", "T", "F", "S", "S"];
    const today = todayYmd();
    for (let i = 0; i < 7; i++) {
      const date = addDaysYmd(weekStart, i);
      const hasXp = logs.some((l) => l.date === date);
      arr.push({ label: names[i], date, hasXp: !!hasXp && date <= today });
    }
    return arr;
  }, [logs, weekStart]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Mission Dashboard
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600">
          See your XP, streak, and skill balance. Use this as your control
          center before you jump into missions or focus mode.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Current tier"
          value={tier}
          subtitle={`${derived.levelXpTotal} XP total`}
          className="md:col-span-1"
        />
        <section className="md:col-span-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <div className="font-medium uppercase tracking-wide text-zinc-500">
              Weekly XP
            </div>
            <div className="text-zinc-500">
              {derived.weeklyXpEarned} / {weeklyPlan.xpTarget} XP
            </div>
          </div>
          <div className="mt-2">
            <ProgressBar value={derived.weeklyXpEarned} max={weeklyPlan.xpTarget || 1} />
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            {weeklyPct.toFixed(0)}% of this week&apos;s target
          </div>
        </section>
        <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Streak
              </div>
              <StreakBadge days={derived.streakDays} />
            </div>
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            Complete at least one mission today to keep the chain.
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1 text-[11px] text-zinc-600">
            {weekDays.map((d) => (
              <div key={d.date} className="flex flex-col items-center gap-1">
                <div className="text-[10px] text-zinc-500">{d.label}</div>
                <div
                  className={`h-5 w-5 rounded-md border ${
                    d.hasXp
                      ? "border-emerald-500 bg-emerald-100"
                      : "border-zinc-200 bg-zinc-50"
                  }`}
                />
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <SkillDistribution distribution={derived.skillDistribution7d} />
        <section className="flex flex-col justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Level progress
              </div>
              <div className="mt-1 text-sm text-zinc-600">
                From {range.min} to {range.max} XP ({tier})
              </div>
            </div>
            <div className="text-right text-xs text-zinc-500">
              <div>{tierProgress} XP into {tier}</div>
              <div>{tierMax - tierProgress} XP to next tier checkpoint</div>
            </div>
          </div>
          <ProgressBar value={tierProgress} max={tierMax || 1} />
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-zinc-100 px-2 py-1 text-zinc-700">
              User: {user.displayName}
            </span>
            <span className="rounded-full bg-zinc-100 px-2 py-1 text-zinc-700">
              Today: {derived.todayYmd}
            </span>
          </div>
        </section>
      </section>

      <section className="mt-2 flex flex-wrap gap-3 text-sm">
        <a
          href="/missions"
          className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600"
        >
          Start mission
        </a>
        <a
          href="/focus"
          className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50"
        >
          Enter focus mode
        </a>
        <a
          href="/planner"
          className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50"
        >
          Adjust weekly plan
        </a>
      </section>
    </div>
  );
}

