type Props = {
  value: number;
  max: number;
};

export function ProgressBar({ value, max }: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-2 w-full rounded-full bg-zinc-100">
      <div
        className="h-2 rounded-full bg-accent transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

