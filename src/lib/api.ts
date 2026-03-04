import type {
  FeedbackItem,
  MissionLog,
  MissionTemplate,
  Skill,
  SkillId,
  User,
  VocabItem,
  WeeklyPlan,
  WritingFeedback,
  SpeakingFeedback,
} from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

function tokenHeader(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...tokenHeader(),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, body);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`API ${status}: ${body}`);
    this.name = "ApiError";
  }
}

// ── Auth ──────────────────────────────────────────────

export type AuthResponse = {
  userId: string;
  token: string;
  user: User;
};

export function login(email: string, password: string) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(email: string, password: string) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ── User ──────────────────────────────────────────────

export function getMe() {
  return request<User>("/users/me");
}

export function updateMe(patch: {
  displayName?: string;
  weeklyXpTarget?: number;
  rewardPointsUsed?: number;
}) {
  return request<User>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

// ── Reference data (no auth) ──────────────────────────

export function listSkills() {
  return request<Skill[]>("/skills");
}

export function listMissionTemplates() {
  return request<MissionTemplate[]>("/missions/templates");
}

// ── Mission Logs ──────────────────────────────────────

export function listMissionLogs(fromDate?: string, toDate?: string) {
  const params = new URLSearchParams();
  if (fromDate) params.set("fromDate", fromDate);
  if (toDate) params.set("toDate", toDate);
  const qs = params.toString();
  return request<MissionLog[]>(`/users/me/logs${qs ? `?${qs}` : ""}`);
}

export function createMissionLog(body: {
  missionTemplateId: string;
  date?: string;
  durationMinutes?: number;
  difficulty?: number;
  notes?: string;
}) {
  return request<MissionLog>("/users/me/logs", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ── Weekly Plan ───────────────────────────────────────

export function getCurrentPlan() {
  return request<WeeklyPlan>("/users/me/plans/current");
}

export function upsertCurrentPlan(body: {
  xpTarget?: number;
  skillFocusPercentages?: Record<string, number>;
}) {
  return request<WeeklyPlan>("/users/me/plans/current", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

// ── Feedback ──────────────────────────────────────────

type FeedbackListResponse = {
  writing: WritingFeedback[];
  speaking: SpeakingFeedback[];
};

export async function listFeedback(): Promise<FeedbackItem[]> {
  const data = await request<FeedbackListResponse>("/users/me/feedback");
  const items: FeedbackItem[] = [];
  for (const w of data.writing ?? []) items.push({ kind: "writing", item: w });
  for (const s of data.speaking ?? []) items.push({ kind: "speaking", item: s });
  return items;
}

export function createWritingFeedback(body: {
  title: string;
  prompt?: string;
  text: string;
  corrections?: Array<{ from: string; to: string; note?: string }>;
  repeatedMistakeTags?: string[];
}) {
  return request<WritingFeedback>("/users/me/feedback/writing", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function createSpeakingFeedback(body: {
  title: string;
  audioFileName?: string;
  checklist?: { endingSounds: boolean; linking: boolean; stress: boolean; clarity: boolean };
  comments?: string;
  issueTags?: string[];
}) {
  return request<SpeakingFeedback>("/users/me/feedback/speaking", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ── Vocabulary ────────────────────────────────────────

export function listVocabulary() {
  return request<VocabItem[]>("/users/me/vocabulary");
}

export function createVocabItem(body: {
  term: string;
  topicTags?: string[];
  collocations?: string[];
  examples?: string[];
  usageNotes?: string;
}) {
  return request<VocabItem>("/users/me/vocabulary", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function deleteVocabItem(id: string) {
  return request<void>(`/users/me/vocabulary/${id}`, { method: "DELETE" });
}

// ── Stats ─────────────────────────────────────────────

export type UserStats = {
  streak: number;
  weeklyXpEarned: number;
  skillDistribution7d: Record<SkillId, number>;
};

export function getUserStats() {
  return request<UserStats>("/users/me/stats");
}
