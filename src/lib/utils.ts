import clsx from "clsx";
import type { SkillId } from "@/lib/types";

export function cn(...args: Array<unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return clsx(args as any);
}

export function skillLabel(skillId: SkillId) {
  switch (skillId) {
    case "reading":
      return "Reading";
    case "listening":
      return "Listening";
    case "speaking":
      return "Speaking";
    case "writing":
      return "Writing";
    case "vocabulary":
      return "Vocabulary";
  }
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function formatPct(n: number) {
  return `${Math.round(n)}%`;
}

