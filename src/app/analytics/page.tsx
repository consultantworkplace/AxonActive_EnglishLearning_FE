"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import type { SkillId } from "@/lib/types";
import { lastNDaysYmd } from "@/lib/date";
import { XpHistoryChart } from "@/components/Charts/XpHistoryChart";
import { SkillRadar } from "@/components/Charts/SkillRadar";
import { StatsCard } from "@/components/StatsCard";
import { skillLabel } from "@/lib/utils";

export default function AnalyticsPage() {
  const { logs, derived } = useAppStore();

  const historyData = useMemo(() => {
    const days = lastNDaysYmd(21, derived.todayYmd);
    return days.map((d) => ({
      date: d,
      xp: logs
        .filter((l) => l.date === d)
        .reduce((sum, l) => sum + l.xpEarned, 0),
    }));
  }, [logs, derived.todayYmd]);

  const freqStats = useMemo(() => {
    const last14 = new Set(lastNDaysYmd(14, derived.todayYmd));
    let speakingCount = 0;
    let writingCount = 0;
    const dayWithActivity = new Set<string>();
    const skillTotal: Record<SkillId, number> = {
      reading: 0,
      listening: 0,
      speaking: 0,
      writing: 0,
      vocabulary: 0,
    };

    for (const log of logs) {
      if (!last14.has(log.date)) continue;
      dayWithActivity.add(log.date);
      skillTotal[log.skillId] += log.xpEarned;
      if (log.skillId === "speaking") speakingCount++;
      if (log.skillId === "writing") writingCount++;
    }

    const totalDays = last14.size || 1;
    const consistencyScore = Math.round(
      (dayWithActivity.size / totalDays) * 100
    );

    let weakest: SkillId = "speaking";
    let minXp = Number.POSITIVE_INFINITY;
    (Object.keys(skillTotal) as SkillId[]).forEach((id) => {
      if (skillTotal[id] < minXp) {
        minXp = skillTotal[id];
        weakest = id;
      }
    });

    return {
      speakingCount,
      writingCount,
      consistencyScore,
      weakestSkill: weakest,
      weakestSkillXp: minXp,
    };
  }, [logs, derived.todayYmd]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Analytics
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600">
          Review your XP history, balance across skills, and consistency. Use
          this to adjust your system, not to judge yourself.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Speaking reps (14d)"
          value={String(freqStats.speakingCount)}
          subtitle="Short speaking missions completed"
        />
        <StatsCard
          title="Writing reps (14d)"
          value={String(freqStats.writingCount)}
          subtitle="Writing / dictation missions completed"
        />
        <StatsCard
          title="Consistency score"
          value={`${freqStats.consistencyScore}%`}
          subtitle="Days with any XP / last 14 days"
        />
        <StatsCard
          title="Weakest skill"
          value={skillLabel(freqStats.weakestSkill)}
          subtitle={`XP in 14d: ${freqStats.weakestSkillXp}`}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <XpHistoryChart data={historyData} />
        <SkillRadar distribution={derived.skillDistribution7d} />
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-600 shadow-sm">
        <p>
          Interpretation tips: if your consistency is above ~70%, you are doing
          well even if some weeks feel &quot;messy&quot;. Use the weakest skill
          as your focus for the next 2–3 weeks, not forever. Remember this is a
          system for long-term mastery, not a one-week challenge.
        </p>
      </section>
    </div>
  );
}

