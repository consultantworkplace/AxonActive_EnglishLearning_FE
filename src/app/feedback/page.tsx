"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";

export default function FeedbackPage() {
  const { feedback } = useAppStore();
  const [selectedWritingId, setSelectedWritingId] = useState<string | null>(
    null
  );
  const [selectedSpeakingId, setSelectedSpeakingId] = useState<string | null>(
    null
  );

  const writingItems = feedback.filter((f) => f.kind === "writing");
  const speakingItems = feedback.filter((f) => f.kind === "speaking");

  const activeWriting =
    writingItems.find((f) => f.item.id === selectedWritingId) ||
    writingItems[0] ||
    null;
  const activeSpeaking =
    speakingItems.find((f) => f.item.id === selectedSpeakingId) ||
    speakingItems[0] ||
    null;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Feedback loop
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600">
          Store your writing and speaking samples together with corrections and
          recurring mistakes. The goal is to learn from each rep, not to be
          perfect.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs shadow-sm">
          <header className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Writing feedback
              </div>
              <p className="mt-1 text-xs text-zinc-600">
                Upload essays in the future. For now, review a mock sample and
                its corrections.
              </p>
            </div>
            <label className="cursor-pointer rounded-full border border-zinc-300 px-3 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50">
              Upload draft
              <input type="file" className="hidden" disabled />
            </label>
          </header>

          {activeWriting && activeWriting.kind === "writing" && (
            <>
              <div className="flex flex-wrap gap-2">
                {writingItems.map((item) => (
                  <button
                    key={item.item.id}
                    type="button"
                    onClick={() => setSelectedWritingId(item.item.id)}
                    className={`rounded-full px-3 py-1 text-[11px] ${
                      item.item.id === activeWriting.item.id
                        ? "bg-accent text-white"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {item.item.title}
                  </button>
                ))}
              </div>

              <div className="mt-2 rounded-md border border-zinc-200 bg-zinc-50 p-2 text-[11px] text-zinc-700">
                <div className="mb-1 font-medium">
                  {activeWriting.item.title}
                </div>
                {activeWriting.item.prompt && (
                  <div className="mb-1 text-zinc-500">
                    Prompt: {activeWriting.item.prompt}
                  </div>
                )}
                <p>{activeWriting.item.text}</p>
              </div>

              <div className="mt-2">
                <div className="font-medium text-zinc-700">Corrections</div>
                <ul className="mt-1 space-y-1 text-[11px] text-zinc-700">
                  {activeWriting.item.corrections.map((c, idx) => (
                    <li
                      key={`${c.from}-${c.to}-${idx}`}
                      className="rounded-md bg-white px-2 py-1"
                    >
                      <span className="line-through text-zinc-400">
                        {c.from}
                      </span>{" "}
                      → <span className="font-semibold">{c.to}</span>
                      {c.note && (
                        <span className="text-zinc-500"> — {c.note}</span>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeWriting.item.repeatedMistakeTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] text-rose-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs shadow-sm">
          <header className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Speaking feedback
              </div>
              <p className="mt-1 text-xs text-zinc-600">
                Record short clips and get notes on pronunciation, stress, and
                clarity. For now, this is a mock example.
              </p>
            </div>
            <label className="cursor-pointer rounded-full border border-zinc-300 px-3 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50">
              Upload audio
              <input type="file" className="hidden" accept="audio/*" disabled />
            </label>
          </header>

          {activeSpeaking && activeSpeaking.kind === "speaking" && (
            <>
              <div className="flex flex-wrap gap-2">
                {speakingItems.map((item) => (
                  <button
                    key={item.item.id}
                    type="button"
                    onClick={() => setSelectedSpeakingId(item.item.id)}
                    className={`rounded-full px-3 py-1 text-[11px] ${
                      item.item.id === activeSpeaking.item.id
                        ? "bg-accent text-white"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {item.item.title}
                  </button>
                ))}
              </div>

              <div className="mt-2 rounded-md border border-zinc-200 bg-zinc-50 p-2 text-[11px] text-zinc-700">
                <div className="mb-1 font-medium">
                  {activeSpeaking.item.title}
                </div>
                <div className="mb-1 text-zinc-500">
                  File: {activeSpeaking.item.audioFileName}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 ${
                      activeSpeaking.item.checklist.endingSounds
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    Ending sounds
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 ${
                      activeSpeaking.item.checklist.linking
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    Linking
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 ${
                      activeSpeaking.item.checklist.stress
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    Stress
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 ${
                      activeSpeaking.item.checklist.clarity
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    Clarity
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <div className="font-medium text-zinc-700">Coach comments</div>
                <p className="mt-1 rounded-md bg-white px-2 py-1 text-[11px] text-zinc-700">
                  {activeSpeaking.item.comments}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeSpeaking.item.issueTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-600 shadow-sm">
        <p>
          Recommendation: keep this page open during review sessions. After each
          writing or speaking mission, quickly log one or two key corrections
          and one pattern you want to avoid next time. That is your feedback
          loop in action.
        </p>
      </section>
    </div>
  );
}

