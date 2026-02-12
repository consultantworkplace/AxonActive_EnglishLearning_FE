import { cn } from "@/lib/utils";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  className?: string;
};

export function StatsCard({ title, value, subtitle, className }: Props) {
  return (
    <section
      className={cn(
        "rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm",
        className
      )}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {title}
      </div>
      <div className="mt-1 text-2xl font-semibold text-zinc-900">{value}</div>
      {subtitle && (
        <div className="mt-1 text-xs text-zinc-500">{subtitle}</div>
      )}
    </section>
  );
}

