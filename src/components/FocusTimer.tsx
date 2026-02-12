"use client";

import { useEffect, useState } from "react";

type Props = {
  onCompletedSession: () => void;
};

const PRESETS = [
  { label: "10 min", seconds: 10 * 60 },
  { label: "15 min", seconds: 15 * 60 },
  { label: "25 min", seconds: 25 * 60 },
  { label: "50 min", seconds: 50 * 60 },
];

export function FocusTimer({ onCompletedSession }: Props) {
  const [total, setTotal] = useState<number>(15 * 60);
  const [remaining, setRemaining] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const [askDone, setAskDone] = useState(false);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setRunning(false);
          setAskDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, remaining]);

  const startTimer = (secs: number) => {
    setTotal(secs);
    setRemaining(secs);
    setRunning(true);
    setAskDone(false);
  };

  const minutes = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remaining % 60).toString().padStart(2, "0");
  const pct = total > 0 ? (remaining / total) * 100 : 0;

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Monk mode timer
        </div>
        <div className="text-sm text-zinc-600">
          One block, one mission, zero multitasking.
        </div>
      </div>

      <div className="relative flex h-52 w-52 items-center justify-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-zinc-200"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-accent"
            strokeWidth="6"
            fill="none"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * pct) / 100}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-semibold tabular-nums text-zinc-900">
            {minutes}:{seconds}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            {running ? "Deep work in progress" : "Ready for next block"}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => startTimer(p.seconds)}
            disabled={running}
            className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            setRemaining(0);
            setAskDone(false);
          }}
          className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 hover:bg-zinc-50"
        >
          Reset
        </button>
      </div>

      {askDone && (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          <div className="font-medium">
            Block finished. Did you complete a mission?
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                onCompletedSession();
                setAskDone(false);
              }}
              className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
            >
              Yes, log XP
            </button>
            <button
              type="button"
              onClick={() => setAskDone(false)}
              className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs text-emerald-800 hover:bg-emerald-100"
            >
              Not this time
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

