export default function GuidePage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          How to use this website
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600">
          This is a mission-based English training system for busy people. The
          goal is discipline and deep work, not endless content.
        </p>
      </header>

      <section className="space-y-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-900">
          1. Daily flow (short version)
        </h2>
        <ol className="list-decimal space-y-1 pl-4 text-sm text-zinc-700">
          <li>Open the Dashboard to see XP, streak, and weakest skill.</li>
          <li>
            Go to{" "}
            <span className="font-semibold text-zinc-900">Missions</span> and
            choose one micro-mission that fits your time and focus.
          </li>
          <li>
            Optionally open{" "}
            <span className="font-semibold text-zinc-900">Focus Mode</span> for
            a 10–25 minute deep-work block.
          </li>
          <li>Complete the mission fully, then mark it as done for XP.</li>
          <li>
            If you wrote or spoke, log key corrections on the{" "}
            <span className="font-semibold text-zinc-900">Feedback</span> page.
          </li>
        </ol>
      </section>

      <section className="space-y-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-900">
          2. Pages and what they are for
        </h2>
        <ul className="space-y-2 text-sm text-zinc-700">
          <li>
            <span className="font-semibold text-zinc-900">Dashboard</span> – see
            your current tier (Bronze → Diamond), weekly XP progress, streak,
            and skill balance. Use this to decide today&apos;s focus.
          </li>
          <li>
            <span className="font-semibold text-zinc-900">Missions</span> – small,
            clear tasks (listening, speaking, reading, writing, vocabulary) with
            XP and estimated time. Filter by skill and duration, then click
            &quot;Complete now&quot; after you actually finish.
          </li>
          <li>
            <span className="font-semibold text-zinc-900">Weekly Planner</span> –
            set your weekly XP target and adjust how much you focus on each
            skill. The calendar shows which days you earned XP.
          </li>
          <li>
            <span className="font-semibold text-zinc-900">Analytics</span> – see
            XP history, how balanced your skills are, your consistency score,
            and the weakest skill to focus on next.
          </li>
          <li>
            <span className="font-semibold text-zinc-900">Feedback</span> – keep
            examples of your writing and speaking with corrections and repeated
            mistakes. This is your feedback loop.
          </li>
          <li>
            <span className="font-semibold text-zinc-900">Vocabulary</span> – store
            useful words and collocations by topic and run quick quiz rounds to
            push them into active use.
          </li>
          <li>
            <span className="font-semibold text-zinc-900">Focus Mode</span> –
            full-screen timer for 10–25 minute deep-work blocks. One timer =
            one mission, no multitasking.
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-900">
          3. Discipline rules this site assumes
        </h2>
        <ul className="list-disc space-y-1 pl-4 text-sm text-zinc-700">
          <li>Always pick one mission at a time (no multitasking).</li>
          <li>Use short, intense blocks instead of long, unfocused sessions.</li>
          <li>Count a mission as &quot;done&quot; only if you really did it.</li>
          <li>Review Analytics weekly and adjust your Weekly Planner.</li>
          <li>Use Feedback to write down patterns, not every small mistake.</li>
        </ul>
      </section>

      <section className="space-y-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-600 shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-900">
          4. Suggested starting routine
        </h2>
        <p>
          If you are not sure how to begin: 3–5 days per week, run one 15–25
          minute mission block (listening/speaking), plus 10 minutes of
          reading/vocabulary, and review Analytics every Sunday to see your
          streak and weakest skill.
        </p>
      </section>
    </div>
  );
}

