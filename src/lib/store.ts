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
import * as api from "@/lib/api";
import { todayYmd, weekStartMondayYmd } from "@/lib/date";

// ── Defaults (shown while loading / logged-out) ──────

const emptyUser: User = {
  id: "",
  email: "",
  displayName: "Guest",
  xpTotal: 0,
  weeklyXpTarget: 450,
  rewardPointsUsed: 0,
};

const defaultPlan: WeeklyPlan = {
  weekStartDate: weekStartMondayYmd(todayYmd()),
  xpTarget: 450,
  skillFocusPercentages: {
    reading: 25,
    listening: 25,
    speaking: 20,
    writing: 20,
    vocabulary: 10,
  },
};

// ── Types ─────────────────────────────────────────────

export type AppState = {
  token: string | null;
  user: User;
  skills: Skill[];
  missionTemplates: MissionTemplate[];
  logs: MissionLog[];
  weeklyPlan: WeeklyPlan;
  feedback: FeedbackItem[];
  vocab: VocabItem[];
  loading: boolean;
  error: string | null;
};

export type DerivedStats = {
  todayYmd: string;
  streakDays: number;
  levelXpTotal: number;
  weeklyXpEarned: number;
  skillDistribution7d: Record<SkillId, number>;
};

export type AppActions = {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadData: () => Promise<void>;
  tryRestoreSession: () => Promise<void>;

  completeMission: (templateId: string) => Promise<void>;
  setWeeklyTarget: (xp: number) => Promise<void>;
  setSkillFocus: (percentages: Partial<Record<SkillId, number>>) => Promise<void>;
  setRewardPointsUsed: (points: number) => Promise<void>;
};

type Store = AppState & {
  derived: DerivedStats;
  actions: AppActions;
};

// ── Derived stats (computed from server stats + local state) ──

function computeDerived(
  state: AppState,
  serverStats?: api.UserStats,
): DerivedStats {
  const today = todayYmd();

  if (serverStats) {
    const dist = serverStats.skillDistribution7d;
    const total = Object.values(dist).reduce((a, b) => a + b, 0) || 1;
    const distribution: Record<SkillId, number> = {
      reading: ((dist.reading ?? 0) / total) * 100,
      listening: ((dist.listening ?? 0) / total) * 100,
      speaking: ((dist.speaking ?? 0) / total) * 100,
      writing: ((dist.writing ?? 0) / total) * 100,
      vocabulary: ((dist.vocabulary ?? 0) / total) * 100,
    };

    return {
      todayYmd: today,
      streakDays: serverStats.streak,
      levelXpTotal: state.user.xpTotal,
      weeklyXpEarned: serverStats.weeklyXpEarned,
      skillDistribution7d: distribution,
    };
  }

  return {
    todayYmd: today,
    streakDays: 0,
    levelXpTotal: state.user.xpTotal,
    weeklyXpEarned: 0,
    skillDistribution7d: {
      reading: 20,
      listening: 20,
      speaking: 20,
      writing: 20,
      vocabulary: 20,
    },
  };
}

// ── Store ─────────────────────────────────────────────

export const useAppStore = create<Store>((set, get) => {
  const initial: AppState = {
    token: null,
    user: emptyUser,
    skills: [],
    missionTemplates: [],
    logs: [],
    weeklyPlan: defaultPlan,
    feedback: [],
    vocab: [],
    loading: true,
    error: null,
  };

  return {
    ...initial,
    derived: computeDerived(initial),
    actions: {
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const resp = await api.login(email, password);
          localStorage.setItem("jwt", resp.token);
          set({ token: resp.token, user: resp.user, loading: false });
          await get().actions.loadData();
        } catch (e) {
          const msg = e instanceof api.ApiError && e.status === 401
            ? "Invalid email or password"
            : "Login failed. Please try again.";
          set({ loading: false, error: msg });
          throw e;
        }
      },

      register: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const resp = await api.register(email, password);
          localStorage.setItem("jwt", resp.token);
          set({ token: resp.token, user: resp.user, loading: false });
          await get().actions.loadData();
        } catch (e) {
          const msg = e instanceof api.ApiError && e.status === 409
            ? "Email already in use"
            : "Registration failed. Please try again.";
          set({ loading: false, error: msg });
          throw e;
        }
      },

      logout: () => {
        localStorage.removeItem("jwt");
        set({
          token: null,
          user: emptyUser,
          logs: [],
          weeklyPlan: defaultPlan,
          feedback: [],
          vocab: [],
          error: null,
          derived: computeDerived(initial),
        });
      },

      tryRestoreSession: async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
        if (!token) {
          set({ loading: false });
          return;
        }
        set({ token, loading: true });
        try {
          const user = await api.getMe();
          set({ user });
          await get().actions.loadData();
        } catch {
          localStorage.removeItem("jwt");
          set({ token: null, loading: false });
        }
      },

      loadData: async () => {
        set({ loading: true, error: null });
        try {
          const [skills, templates, logs, plan, feedback, vocab, stats] =
            await Promise.all([
              api.listSkills(),
              api.listMissionTemplates(),
              api.listMissionLogs(),
              api.getCurrentPlan().catch(() => null),
              api.listFeedback().catch(() => []),
              api.listVocabulary().catch(() => []),
              api.getUserStats().catch(() => null),
            ]);

          const currentPlan = plan ?? defaultPlan;
          const normalizedPlan: WeeklyPlan = {
            ...currentPlan,
            skillFocusPercentages: {
              reading: currentPlan.skillFocusPercentages?.reading ?? 25,
              listening: currentPlan.skillFocusPercentages?.listening ?? 25,
              speaking: currentPlan.skillFocusPercentages?.speaking ?? 20,
              writing: currentPlan.skillFocusPercentages?.writing ?? 20,
              vocabulary: currentPlan.skillFocusPercentages?.vocabulary ?? 10,
            },
          };

          const state = get();
          const nextState: AppState = {
            ...state,
            skills,
            missionTemplates: templates,
            logs,
            weeklyPlan: normalizedPlan,
            feedback,
            vocab,
            loading: false,
          };

          set({
            ...nextState,
            derived: computeDerived(nextState, stats ?? undefined),
          });
        } catch (e) {
          set({
            loading: false,
            error: e instanceof Error ? e.message : "Failed to load data",
          });
        }
      },

      completeMission: async (templateId: string) => {
        const state = get();
        const tpl = state.missionTemplates.find((m) => m.id === templateId);
        if (!tpl) return;

        try {
          const newLog = await api.createMissionLog({
            missionTemplateId: tpl.id,
          });
          const user = await api.getMe();
          const stats = await api.getUserStats();

          const nextState: AppState = {
            ...get(),
            user,
            logs: [...get().logs, newLog],
          };
          set({
            ...nextState,
            derived: computeDerived(nextState, stats),
          });
        } catch (e) {
          set({ error: e instanceof Error ? e.message : "Failed to complete mission" });
        }
      },

      setWeeklyTarget: async (xp: number) => {
        try {
          const [plan, user] = await Promise.all([
            api.upsertCurrentPlan({ xpTarget: xp }),
            api.updateMe({ weeklyXpTarget: xp }),
          ]);

          const normalizedPlan: WeeklyPlan = {
            ...plan,
            skillFocusPercentages: {
              reading: plan.skillFocusPercentages?.reading ?? 25,
              listening: plan.skillFocusPercentages?.listening ?? 25,
              speaking: plan.skillFocusPercentages?.speaking ?? 20,
              writing: plan.skillFocusPercentages?.writing ?? 20,
              vocabulary: plan.skillFocusPercentages?.vocabulary ?? 10,
            },
          };

          set({
            user,
            weeklyPlan: normalizedPlan,
          });
        } catch (e) {
          set({ error: e instanceof Error ? e.message : "Failed to update target" });
        }
      },

      setSkillFocus: async (percentages: Partial<Record<SkillId, number>>) => {
        const state = get();
        const merged: Record<SkillId, number> = {
          ...state.weeklyPlan.skillFocusPercentages,
          ...percentages,
        };

        try {
          const plan = await api.upsertCurrentPlan({
            xpTarget: state.weeklyPlan.xpTarget,
            skillFocusPercentages: merged,
          });

          const normalizedPlan: WeeklyPlan = {
            ...plan,
            skillFocusPercentages: {
              reading: plan.skillFocusPercentages?.reading ?? merged.reading,
              listening: plan.skillFocusPercentages?.listening ?? merged.listening,
              speaking: plan.skillFocusPercentages?.speaking ?? merged.speaking,
              writing: plan.skillFocusPercentages?.writing ?? merged.writing,
              vocabulary: plan.skillFocusPercentages?.vocabulary ?? merged.vocabulary,
            },
          };

          set({ weeklyPlan: normalizedPlan });
        } catch (e) {
          set({ error: e instanceof Error ? e.message : "Failed to update focus" });
        }
      },

      setRewardPointsUsed: async (points: number) => {
        const rounded = Math.max(0, Math.floor(points));
        try {
          const user = await api.updateMe({ rewardPointsUsed: rounded });
          set({ user });
        } catch (e) {
          set({ error: e instanceof Error ? e.message : "Failed to update reward points" });
        }
      },
    },
  };
});
