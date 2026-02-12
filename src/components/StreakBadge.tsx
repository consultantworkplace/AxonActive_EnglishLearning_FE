type Props = {
  days: number;
};

export function StreakBadge({ days }: Props) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-amber-400 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
      <span>🔥</span>
      <span>{days} day streak</span>
    </div>
  );
}

