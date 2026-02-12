import { create } from "zustand";
import type {
  FeedbackItem,
  MissionLog,
  MissionTemplate,
  Skill,
  SkillId,
  User,
  VocabItem,
  WeeklyPlan,
} from "@/lib/types";
import {
  defaultUser,
  missionTemplates,
  seedFeedback,
  seedLogs,
  seedPlan,
  seedVocab,
  skills,
} from "@/lib/mockSeed";
import { lastNDaysYmd, todayYmd, weekStartMondayYmd } from "@/lib/date";

export type AppState = {
  user: User;
  skills: Skill[];
  missionTemplates: MissionTemplate[];
  logs: MissionLog[];
  weeklyPlan: WeeklyPlan;
  feedback: FeedbackItem[];
  vocab: VocabItem[];
};

export type DerivedStats = {
  todayYmd: string;
  streakDays: number;
  levelXpTotal: number;
  weeklyXpEarned: number;
  skillDistribution7d: Record<SkillId, number>;
};

export type AppActions = {
  completeMission: (templateId: string) => void;
  setWeeklyTarget: (xp: number) => void;
  setSkillFocus: (percentages: Partial<Record<SkillId, number>>) => void;
};

type Store = AppState & {
  derived: DerivedStats;
  actions: AppActions;
};

function computeDerived(state: AppState): DerivedStats {
  const today = todayYmd();
  const weekStart = weekStartMondayYmd(today);
  const last7 = new Set(lastNDaysYmd(7, today));

  let streak = 0;
  // simple backward walk until first empty day
  for (let i = 0; i < 30; i++) {
    const daysBack = lastNDaysYmd(i + 1, today);
    const ymd = daysBack[0];
    const anyLog = state.logs.some((l) => l.date === ymd);
    if (!anyLog) break;
    streak++;
  }

  let weeklyXpEarned = 0;
  const skillTotals: Record<SkillId, number> = {
    reading: 0,
    listening: 0,
    speaking: 0,
    writing: 0,
    vocabulary: 0,
  };

  for (const log of state.logs) {
    if (log.date >= weekStart && log.date <= today) {
      weeklyXpEarned += log.xpEarned;
    }
    if (last7.has(log.date)) {
      skillTotals[log.skillId] += log.xpEarned;
    }
  }

  const total7 = Object.values(skillTotals).reduce((a, b) => a + b, 0) || 1;
  const distribution: Record<SkillId, number> = {
    reading: (skillTotals.reading / total7) * 100,
    listening: (skillTotals.listening / total7) * 100,
    speaking: (skillTotals.speaking / total7) * 100,
    writing: (skillTotals.writing / total7) * 100,
    vocabulary: (skillTotals.vocabulary / total7) * 100,
  };

  return {
    todayYmd: today,
    streakDays: streak,
    levelXpTotal: state.user.xpTotal,
    weeklyXpEarned,
    skillDistribution7d: distribution,
  };
}

export const useAppStore = create<Store>((set, get) => {
  const initial: AppState = {
    user: defaultUser,
    skills,
    missionTemplates,
    logs: seedLogs,
    weeklyPlan: seedPlan,
    feedback: seedFeedback,
    vocab: seedVocab,
  };

  const derived = computeDerived(initial);

  return {
    ...initial,
    derived,
    actions: {
      completeMission: (templateId: string) => {
        const state = get();
        const tpl = state.missionTemplates.find((m) => m.id === templateId);
        if (!tpl) return;
        const today = todayYmd();
        const newLog: MissionLog = {
          id: `log-${Date.now()}`,
          date: today,
          missionTemplateId: tpl.id,
          skillId: tpl.skillId,
          durationMinutes: tpl.estMinutes,
          xpEarned: tpl.xp,
          difficulty: tpl.difficulty,
        };
        const nextState: AppState = {
          ...state,
          user: { ...state.user, xpTotal: state.user.xpTotal + tpl.xp },
          logs: [...state.logs, newLog],
        };
        set({
          ...nextState,
          derived: computeDerived(nextState),
        });
      },
      setWeeklyTarget: (xp: number) => {
        const state = get();
        const nextPlan: WeeklyPlan = {
          ...state.weeklyPlan,
          xpTarget: xp,
        };
        const next: AppState = {
          ...state,
          user: { ...state.user, weeklyXpTarget: xp },
          weeklyPlan: nextPlan,
        };
        set({
          ...next,
          derived: computeDerived(next),
        });
      },
      setSkillFocus: (percentages: Partial<Record<SkillId, number>>) => {
        const state = get();
        const merged: Record<SkillId, number> = {
          ...state.weeklyPlan.skillFocusPercentages,
          ...percentages,
        };
        const nextPlan: WeeklyPlan = {
          ...state.weeklyPlan,
          skillFocusPercentages: merged,
        };
        const next: AppState = {
          ...state,
          weeklyPlan: nextPlan,
        };
        set({
          ...next,
          derived: computeDerived(next),
        });
      },
    },
  };
});

