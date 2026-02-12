export type SkillId =
  | "reading"
  | "listening"
  | "speaking"
  | "writing"
  | "vocabulary";

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export type LevelTier = "Bronze" | "Silver" | "Gold" | "Diamond";

export type User = {
  id: string;
  displayName: string;
  xpTotal: number;
  weeklyXpTarget: number;
};

export type Skill = {
  id: SkillId;
  label: string;
};

export type MissionTemplate = {
  id: string;
  skillId: SkillId;
  title: string;
  description: string;
  xp: number;
  estMinutes: number;
  difficulty: Difficulty;
};

export type MissionLog = {
  id: string;
  date: string; // YYYY-MM-DD (local)
  missionTemplateId: string;
  skillId: SkillId;
  durationMinutes: number;
  xpEarned: number;
  difficulty: Difficulty;
  notes?: string;
};

export type WeeklyPlan = {
  weekStartDate: string; // YYYY-MM-DD (Mon)
  xpTarget: number;
  skillFocusPercentages: Record<SkillId, number>; // 0..100
};

export type WritingFeedback = {
  id: string;
  createdAt: string; // YYYY-MM-DD
  title: string;
  prompt?: string;
  text: string;
  corrections: Array<{ from: string; to: string; note?: string }>;
  repeatedMistakeTags: string[];
};

export type SpeakingFeedback = {
  id: string;
  createdAt: string; // YYYY-MM-DD
  title: string;
  audioFileName: string;
  checklist: {
    endingSounds: boolean;
    linking: boolean;
    stress: boolean;
    clarity: boolean;
  };
  comments: string;
  issueTags: string[];
};

export type FeedbackItem =
  | { kind: "writing"; item: WritingFeedback }
  | { kind: "speaking"; item: SpeakingFeedback };

export type VocabItem = {
  id: string;
  term: string;
  topicTags: string[];
  collocations: string[];
  examples: string[];
  usageNotes?: string;
};

