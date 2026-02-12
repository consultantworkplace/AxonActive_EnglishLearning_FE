import type { ReactNode } from "react";

type DayInfo = {
  date: string; // YYYY-MM-DD
  label: string; // Mon, Tue...
  isToday: boolean;
  xpEarned: number;
};

type Props = {
  days: DayInfo[];
  footer?: ReactNode;
};

export function WeeklyCalendar({ days, footer }: Props) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Week overview
          </div>
          <p className="mt-1 text-xs text-zinc-600">
            Each day with XP {'>'} 0 keeps your streak alive.
          </p>
        </div>
      </header>
      <div className="grid grid-cols-7 gap-2 text-xs">
        {days.map((day) => (
          <div
            key={day.date}
            className="flex flex-col items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2"
          >
            <div
              className={`rounded-full px-2 py-0.5 text-[11px] ${
                day.isToday
                  ? "bg-accent text-white"
                  : "bg-zinc-100 text-zinc-700"
              }`}
            >
              {day.label}
            </div>
            <div className="text-[11px] text-zinc-500">
              {day.date.slice(5)}
            </div>
            <div
              className={`mt-1 h-8 w-full rounded-md text-center text-[11px] leading-8 ${
                day.xpEarned > 0
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-zinc-100 text-zinc-400"
              }`}
            >
              {day.xpEarned > 0 ? `${day.xpEarned} XP` : "—"}
            </div>
          </div>
        ))}
      </div>
      {footer && <div className="mt-1 text-xs text-zinc-600">{footer}</div>}
    </section>
  );
}

