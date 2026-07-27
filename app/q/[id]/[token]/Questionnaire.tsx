"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Question } from "@/lib/questions";
import { SCALE_LABELS, CATEGORIES } from "@/lib/questions";

interface Props {
  sessionId: string;
  token: string;
  communityName: string;
  questions: Question[];
  initialAnswers: Record<string, number>;
  alreadySubmitted: boolean;
}

const catTitle = (id: string) => CATEGORIES.find((c) => c.id === id)?.title ?? id;

export default function Questionnaire({
  sessionId,
  token,
  communityName,
  questions,
  initialAnswers,
  alreadySubmitted,
}: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>(initialAnswers);
  const [step, setStep] = useState<number>(alreadySubmitted ? -1 : 0); // -1 = done screen, -2 = intro
  const [phase, setPhase] = useState<"intro" | "quiz" | "done">(
    alreadySubmitted ? "done" : "intro"
  );
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const current = questions[step];

  const persist = useCallback(
    async (next: Record<string, number>, submit = false) => {
      try {
        await fetch(`/api/sessions/${sessionId}/answer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, answers: next, submit }),
        });
      } catch {
        /* best effort; retried on submit */
      }
    },
    [sessionId, token]
  );

  const choose = (qid: string, idx: number) => {
    const next = { ...answers, [qid]: idx };
    setAnswers(next);
    // debounce autosave
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persist({ [qid]: idx }), 400);
    // advance
    setTimeout(() => {
      setStep((s) => Math.min(s + 1, total - 1));
    }, 180);
  };

  const options = useMemo(() => {
    if (!current) return [];
    return current.type === "scale" ? SCALE_LABELS : current.options ?? [];
  }, [current]);

  async function submit() {
    setSaving(true);
    await persist(answers, true);
    setSaving(false);
    setPhase("done");
  }

  // ---- Intro screen ----
  if (phase === "intro") {
    return (
      <div className="container">
        <div className="brand-row">
          <div className="logo">♥</div>
          <span>Two Hearts</span>
        </div>
        <div className="card">
          <div className="pill">🔒 Private to you</div>
          <h2 style={{ marginTop: 14 }}>Before you begin</h2>
          <p className="muted">
            There are {total} short questions in the{" "}
            <strong>{communityName}</strong> set. Answer honestly — your partner
            will <strong>never</strong> see how you answered. When you're both
            done, you'll each see a report of where you align and what's worth
            talking through together.
          </p>
          <ul className="muted small" style={{ paddingLeft: 18 }}>
            <li>Your answers save automatically as you go.</li>
            <li>You can close this and come back with the same link.</li>
            <li>There are no right answers — just yours.</li>
          </ul>
          <button className="btn block" style={{ marginTop: 12 }} onClick={() => setPhase("quiz")}>
            Start answering →
          </button>
        </div>
      </div>
    );
  }

  // ---- Done screen ----
  if (phase === "done") {
    return (
      <div className="container">
        <div className="brand-row">
          <div className="logo">♥</div>
          <span>Two Hearts</span>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 46 }}>✓</div>
          <h2>All done — thank you.</h2>
          <p className="muted">
            Your answers are saved and private. As soon as your partner finishes
            too, your compatibility report unlocks.
          </p>
          <a className="btn block" style={{ marginTop: 10 }} href={`/report/${sessionId}/${token}`}>
            Go to our report →
          </a>
          <p className="small muted" style={{ marginTop: 14 }}>
            Nudge your partner to finish their link when they have a quiet moment.
          </p>
        </div>
      </div>
    );
  }

  // ---- Quiz ----
  const pct = Math.round((Math.min(step, total) / total) * 100);
  return (
    <div className="container">
      <div className="row between">
        <div className="brand-row">
          <div className="logo">♥</div>
          <span>Two Hearts</span>
        </div>
        <span className="small muted">
          {step + 1} of {total}
        </span>
      </div>

      <div className="progress" style={{ marginTop: 16 }}>
        <span style={{ width: `${pct}%` }} />
      </div>

      {current && (
        <div className="card">
          <div className="pill" style={{ background: "var(--rose-soft)", color: "var(--rose)" }}>
            {catTitle(current.category)}
          </div>
          <h2 style={{ marginTop: 14 }}>{current.text}</h2>
          {current.help && <p className="small muted">{current.help}</p>}

          <div className="choices">
            {options.map((opt, idx) => (
              <div
                key={idx}
                className={`choice ${answers[current.id] === idx ? "selected" : ""}`}
                onClick={() => choose(current.id, idx)}
              >
                <span className="dot" />
                <span>{opt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="row between">
        <button
          className="btn ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          ← Back
        </button>

        {step < total - 1 ? (
          <button
            className="btn secondary"
            onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
          >
            Skip →
          </button>
        ) : (
          <button className="btn" onClick={submit} disabled={saving}>
            {saving ? "Saving…" : "Finish & submit"}
          </button>
        )}
      </div>

      <p className="small muted" style={{ textAlign: "center", marginTop: 18 }}>
        {answeredCount} of {total} answered · saved automatically
        {answeredCount < total && step === total - 1 && (
          <> · you can submit with some left blank</>
        )}
      </p>
    </div>
  );
}
