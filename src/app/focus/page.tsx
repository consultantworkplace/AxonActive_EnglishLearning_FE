"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { FocusTimer } from "@/components/FocusTimer";

export default function FocusPage() {
  const { actions } = useAppStore();
  const [lastLogged, setLastLogged] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-20 bg-white">
      <div className="mx-auto flex h-full max-w-4xl flex-col px-4 py-6">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
              Focus mode
            </h1>
            <p className="text-xs text-zinc-600">
              Full-screen, single-task deep work. Decide your mission before
              starting the timer.
            </p>
          </div>
          <a
            href="/"
            className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50"
          >
            Exit
          </a>
        </header>

        <FocusTimer
          onCompletedSession={() => {
            // For the prototype, award XP via a generic listening mission.
            actions.completeMission("listen-shadowing-5m");
            setLastLogged("listen-shadowing-5m");
          }}
        />

        {lastLogged && (
          <div className="mt-4 text-center text-xs text-zinc-600">
            XP logged for one micro-mission. In a full version, you would tie
            each focus block to a specific mission or note.
          </div>
        )}
      </div>
    </div>
  );
}

