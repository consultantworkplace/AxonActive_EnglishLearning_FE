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
import { addDaysYmd, lastNDaysYmd, todayYmd, weekStartMondayYmd } from "@/lib/date";

export const skills: Skill[] = [
  { id: "reading", label: "Reading" },
  { id: "listening", label: "Listening" },
  { id: "speaking", label: "Speaking" },
  { id: "writing", label: "Writing" },
  { id: "vocabulary", label: "Vocabulary" },
];

export const missionTemplates: MissionTemplate[] = [
  {
    id: "listen-dictation-2m",
    skillId: "listening",
    title: "2-min dictation",
    description: "Pick a short clip, write exactly what you hear, then compare.",
    xp: 30,
    estMinutes: 10,
    difficulty: 3,
  },
  {
    id: "listen-shadowing-5m",
    skillId: "listening",
    title: "5-min shadowing",
    description: "Shadow a transcript. Focus on linking and ending sounds.",
    xp: 25,
    estMinutes: 8,
    difficulty: 2,
  },
  {
    id: "speak-summary-90s",
    skillId: "speaking",
    title: "90s summary speaking",
    description: "Speak a summary of what you learned. Record once; improve once.",
    xp: 35,
    estMinutes: 10,
    difficulty: 3,
  },
  {
    id: "speak-pronunciation-drill",
    skillId: "speaking",
    title: "Pronunciation drill (ending sounds)",
    description: "10 phrases. Slow → clear → slightly faster. No rushing.",
    xp: 20,
    estMinutes: 7,
    difficulty: 2,
  },
  {
    id: "write-micro-essay-120w",
    skillId: "writing",
    title: "Micro essay (120 words)",
    description: "One idea, simple grammar, clarity first. Highlight 3 mistakes.",
    xp: 45,
    estMinutes: 18,
    difficulty: 4,
  },
  {
    id: "write-rewrite",
    skillId: "writing",
    title: "Rewrite for clarity",
    description: "Rewrite a paragraph to be simpler and more direct.",
    xp: 25,
    estMinutes: 10,
    difficulty: 3,
  },
  {
    id: "read-article-10m",
    skillId: "reading",
    title: "10-min reading (95% comprehension)",
    description: "Choose relevant material. Don’t translate word-by-word.",
    xp: 30,
    estMinutes: 10,
    difficulty: 2,
  },
  {
    id: "read-highlight-phrases",
    skillId: "reading",
    title: "Highlight 10 useful phrases",
    description: "Extract phrases you can reuse in writing/speaking.",
    xp: 20,
    estMinutes: 8,
    difficulty: 2,
  },
  {
    id: "vocab-collocations-12",
    skillId: "vocabulary",
    title: "12 collocations (topic-based)",
    description: "Pick a topic; learn collocations with example sentences.",
    xp: 25,
    estMinutes: 10,
    difficulty: 3,
  },
  {
    id: "vocab-quiz-10",
    skillId: "vocabulary",
    title: "Quiz mode (10 items)",
    description: "Quick recall + usage. Focus on active output.",
    xp: 20,
    estMinutes: 6,
    difficulty: 2,
  },
];

export const defaultUser: User = {
  id: "u1",
  displayName: "You",
  xpTotal: 860,
  weeklyXpTarget: 450,
};

const last21 = lastNDaysYmd(21);
const weightedSkills: SkillId[] = [
  // Make it intentionally uneven: strong listening/reading, weaker speaking/writing.
  "listening",
  "listening",
  "reading",
  "listening",
  "reading",
  "vocabulary",
  "writing",
  "speaking",
];

function pickTemplateForSkill(skillId: SkillId) {
  const candidates = missionTemplates.filter((m) => m.skillId === skillId);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export const seedLogs: MissionLog[] = (() => {
  const logs: MissionLog[] = [];
  let xp = defaultUser.xpTotal;

  for (let i = 0; i < last21.length; i++) {
    const ymd = last21[i];
    // skip a few days to create realistic streak breaks
    if (i === 3 || i === 11 || i === 17) continue;

    const sessions = i % 5 === 0 ? 3 : i % 2 === 0 ? 2 : 1;
    for (let s = 0; s < sessions; s++) {
      const skillId = weightedSkills[(i + s) % weightedSkills.length];
      const tpl = pickTemplateForSkill(skillId);
      xp += tpl.xp;
      logs.push({
        id: `log-${i}-${s}`,
        date: ymd,
        missionTemplateId: tpl.id,
        skillId: tpl.skillId,
        durationMinutes: tpl.estMinutes + (s === 0 ? 0 : 2),
        xpEarned: tpl.xp,
        difficulty: tpl.difficulty,
        notes: s === 0 ? "Felt good. Keep it simple." : undefined,
      });
    }
  }
  return logs;
})();

export const seedPlan: WeeklyPlan = {
  weekStartDate: weekStartMondayYmd(todayYmd()),
  xpTarget: defaultUser.weeklyXpTarget,
  skillFocusPercentages: {
    reading: 25,
    listening: 25,
    speaking: 20,
    writing: 20,
    vocabulary: 10,
  },
};

export const seedFeedback: FeedbackItem[] = [
  {
    kind: "writing",
    item: {
      id: "wf-1",
      createdAt: addDaysYmd(todayYmd(), -5),
      title: "Micro essay: Remote work",
      prompt: "Do you think remote work is beneficial?",
      text: "Remote work is benefit for many people. It save time and make me more focus. However it can make communication harder.",
      corrections: [
        { from: "is benefit", to: "is beneficial", note: "Use adjective form." },
        { from: "It save", to: "It saves", note: "3rd person singular." },
        { from: "more focus", to: "more focused", note: "Adjective form." },
        { from: "However it", to: "However, it", note: "Comma after connector." },
      ],
      repeatedMistakeTags: ["verb-s", "adjective-form", "punctuation"],
    },
  },
  {
    kind: "speaking",
    item: {
      id: "sf-1",
      createdAt: addDaysYmd(todayYmd(), -2),
      title: "90s summary: Tech news",
      audioFileName: "tech-summary-90s.wav",
      checklist: {
        endingSounds: false,
        linking: true,
        stress: false,
        clarity: true,
      },
      comments:
        "Good clarity. Work on ending consonants and word stress. Slow down 10%.",
      issueTags: ["ending-sounds", "stress"],
    },
  },
];

export const seedVocab: VocabItem[] = [
  {
    id: "v1",
    term: "trade-off",
    topicTags: ["Work", "Decision-making"],
    collocations: ["make a trade-off", "a trade-off between A and B"],
    examples: [
      "There is a trade-off between speed and accuracy.",
      "We made a trade-off to ship faster this week.",
    ],
    usageNotes: "Use when you must choose between two benefits.",
  },
  {
    id: "v2",
    term: "accountability",
    topicTags: ["Discipline", "Work"],
    collocations: ["accountability partner", "take accountability for"],
    examples: [
      "I need an accountability partner to stay consistent.",
      "Take accountability for the result, not the excuse.",
    ],
  },
  {
    id: "v3",
    term: "consistency",
    topicTags: ["Habits"],
    collocations: ["build consistency", "consistent effort"],
    examples: [
      "Consistency beats intensity over the long term.",
      "A small consistent routine compounds quickly.",
    ],
  },
];

