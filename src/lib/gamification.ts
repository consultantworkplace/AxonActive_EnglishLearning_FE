import type { LevelTier } from "@/lib/types";

export function levelTierFromXp(xpTotal: number): LevelTier {
  if (xpTotal >= 2500) return "Diamond";
  if (xpTotal >= 1000) return "Gold";
  if (xpTotal >= 300) return "Silver";
  return "Bronze";
}

export function tierRange(tier: LevelTier) {
  switch (tier) {
    case "Bronze":
      return { min: 0, max: 300 };
    case "Silver":
      return { min: 300, max: 1000 };
    case "Gold":
      return { min: 1000, max: 2500 };
    case "Diamond":
      return { min: 2500, max: 4000 };
  }
}

