"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  levelFromXp,
  levelProgress,
  rewardPointsFromLevel,
  VND_PER_POINT,
} from "@/lib/gamification";
import { ProgressBar } from "@/components/ProgressBar";
import { StreakBadge } from "@/components/StreakBadge";
import { SkillDistribution } from "@/components/SkillDistribution";
import { LevelRewardsOverlay } from "@/components/LevelRewardsOverlay";
import { AuthGuard } from "@/components/AuthGuard";

export default function Home() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { user, weeklyPlan, derived, actions } = useAppStore();
  const [showRewardsOverlay, setShowRewardsOverlay] = useState(false);

  const level = levelFromXp(derived.levelXpTotal);
  const rewardPoints = rewardPointsFromLevel(level);
  const progress = levelProgress(derived.levelXpTotal);

  const weeklyPct =
    weeklyPlan.xpTarget > 0
      ? Math.min(100, (derived.weeklyXpEarned / weeklyPlan.xpTarget) * 100)
      : 0;

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

      <section className="rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50/80 px-5 py-4">
        <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Your big goal
        </div>
        <p className="mt-2 text-lg font-semibold text-zinc-900">
          e.g. Reach B2 · Pass IELTS 7 · Speak confidently in meetings
        </p>
        <p className="mt-1 text-sm text-zinc-600">
          Set your big goal here so every mission moves you toward what matters.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <button
          type="button"
          onClick={() => setShowRewardsOverlay(true)}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left shadow-sm transition-colors hover:border-accent hover:bg-zinc-50 md:col-span-1"
        >
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Level
          </div>
          <div className="mt-1 text-2xl font-semibold text-zinc-900">
            {level}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            {derived.levelXpTotal} XP · {(rewardPoints * VND_PER_POINT).toLocaleString("vi-VN")} VND
          </div>
          <div className="mt-2 text-[11px] text-zinc-400">
            Click to see rewards
          </div>
        </button>
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
        <section className="flex flex-col items-start justify-between gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm md:col-span-1">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Streak
          </div>
          <StreakBadge days={derived.streakDays} />
          <div className="text-xs text-zinc-500">
            Complete at least one mission today to keep the chain.
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
                {progress.xpInLevel} / 500 XP to Level {level + 1}
              </div>
            </div>
            <div className="text-right text-xs text-zinc-500">
              <div>{progress.xpToNext} XP to next level</div>
            </div>
          </div>
          <ProgressBar value={progress.xpInLevel} max={500} />
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

      {showRewardsOverlay && (
        <LevelRewardsOverlay
          level={level}
          rewardPoints={rewardPoints}
          pointsUsed={user.rewardPointsUsed ?? 0}
          onPointsUsedChange={(v) => actions.setRewardPointsUsed(v)}
          onClose={() => setShowRewardsOverlay(false)}
        />
      )}
    </div>
  );
}
