import type { MissionTemplate } from "@/lib/types";
import { skillLabel } from "@/lib/utils";

type Props = {
  mission: MissionTemplate;
  onComplete: () => void;
};

export function MissionCard({ mission, onComplete }: Props) {
  return (
    <section className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
      <header className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {skillLabel(mission.skillId)}
          </div>
          <h3 className="mt-1 text-sm font-semibold text-zinc-900">
            {mission.title}
          </h3>
        </div>
        <div className="text-right text-xs text-zinc-500">
          <div>{mission.xp} XP</div>
          <div>{mission.estMinutes} min</div>
          <div>Difficulty {mission.difficulty}/5</div>
        </div>
      </header>
      <p className="mt-2 text-xs text-zinc-600">{mission.description}</p>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="rounded-full bg-zinc-100 px-2 py-1 text-zinc-700">
          Micro-mission
        </span>
        <button
          type="button"
          onClick={onComplete}
          className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-600"
        >
          Complete now
        </button>
      </div>
    </section>
  );
}

