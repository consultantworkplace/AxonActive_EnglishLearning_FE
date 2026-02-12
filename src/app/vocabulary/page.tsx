"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";

type QuizItem = {
  id: string;
  term: string;
  example: string;
};

export default function VocabularyPage() {
  const { vocab, actions } = useAppStore();
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [completed, setCompleted] = useState(false);

  const topics = useMemo(() => {
    const set = new Set<string>();
    vocab.forEach((v) => v.topicTags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [vocab]);

  const filtered = useMemo(
    () =>
      vocab.filter((v) =>
        topicFilter === "all" ? true : v.topicTags.includes(topicFilter)
      ),
    [vocab, topicFilter]
  );

  const startQuiz = () => {
    const pool = filtered.length ? filtered : vocab;
    const chosen = pool.slice(0, 5).map((v) => ({
      id: v.id,
      term: v.term,
      example: v.examples[0] ?? "",
    }));
    setQuizItems(chosen);
    setCompleted(false);
  };

  const completeQuiz = () => {
    // Award mock XP via vocab quiz mission if available.
    actions.completeMission("vocab-quiz-10");
    setCompleted(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Vocabulary vault
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600">
          Store and review high-frequency, high-utility words and collocations.
          Focus on usage and examples, not long isolated lists.
        </p>
      </header>

      <section className="flex flex-wrap items-end gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="font-medium text-zinc-600">Topic</label>
          <select
            className="h-8 rounded-md border border-zinc-300 bg-white px-2 text-xs text-zinc-800"
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
          >
            <option value="all">All topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <p className="max-w-sm text-[11px] text-zinc-500">
          Rule: relevant first, fun second. Each item should have at least one
          example you can imagine using in your life or work.
        </p>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {filtered.map((v) => (
          <article
            key={v.id}
            className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs shadow-sm"
          >
            <header className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900">
                {v.term}
              </h3>
              <div className="flex flex-wrap gap-1 text-[10px] text-zinc-500">
                {v.topicTags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </header>
            <div>
              <div className="font-medium text-zinc-700">Collocations</div>
              <ul className="mt-1 list-disc pl-4 text-[11px] text-zinc-700">
                {v.collocations.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-medium text-zinc-700">Examples</div>
              <ul className="mt-1 list-disc pl-4 text-[11px] text-zinc-700">
                {v.examples.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
            {v.usageNotes && (
              <p className="text-[11px] text-zinc-500">{v.usageNotes}</p>
            )}
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-zinc-500">
            No items for this topic yet. In a real version, you would add new
            vocabulary here after missions.
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs shadow-sm">
        <header className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Quiz mode (XP)
            </div>
            <p className="mt-1 text-xs text-zinc-600">
              Quick recall: say a sentence with each word before revealing the
              sample sentence. When you finish one round, mark it as completed
              for XP.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={startQuiz}
              className="rounded-full border border-zinc-300 px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
            >
              New quiz (5 items)
            </button>
            <button
              type="button"
              onClick={completeQuiz}
              disabled={!quizItems.length}
              className="rounded-full bg-accent px-3 py-1.5 text-[11px] font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              Mark round as done
            </button>
          </div>
        </header>

        {completed && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] text-emerald-800">
            Quiz round completed. XP added to your dashboard. In practice, do
            this only after real active recall.
          </div>
        )}

        <div className="mt-1 grid gap-2 md:grid-cols-2">
          {quizItems.map((q) => (
            <div
              key={q.id}
              className="flex flex-col gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2"
            >
              <div className="text-sm font-semibold text-zinc-900">
                {q.term}
              </div>
              <div className="text-[11px] text-zinc-600">
                Example: {q.example}
              </div>
            </div>
          ))}
          {!quizItems.length && (
            <p className="text-[11px] text-zinc-500">
              Start a quiz round to see a small stack of items for active
              recall.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

