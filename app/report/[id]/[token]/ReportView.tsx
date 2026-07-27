"use client";

import { useEffect, useState, useCallback } from "react";

type Alignment = "aligned" | "slight" | "gap" | "incomplete";

interface QuestionResult {
  id: string;
  category: string;
  text: string;
  alignment: Alignment;
  yourAnswerIndex: number | null;
  distance: number | null;
}
interface CategoryResult {
  category: { id: string; title: string; blurb: string };
  alignmentPct: number;
  answered: number;
  total: number;
  results: QuestionResult[];
}
interface Report {
  overallPct: number;
  categories: CategoryResult[];
  strengths: string[];
  talkAbout: string[];
  bothSubmitted: boolean;
}

function barColor(pct: number) {
  if (pct >= 80) return "var(--green)";
  if (pct >= 55) return "var(--amber)";
  return "var(--rose)";
}

function AlignTag({ a }: { a: Alignment }) {
  if (a === "aligned") return <span className="tag green">● Aligned</span>;
  if (a === "slight") return <span className="tag amber">● Close</span>;
  if (a === "gap") return <span className="tag rose">● Worth talking about</span>;
  return <span className="tag gray">○ Not answered</span>;
}

export default function ReportView({ sessionId, token }: { sessionId: string; token: string }) {
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "waiting"; you: boolean; partner: boolean }
    | { status: "ready"; report: Report }
    | { status: "error"; message: string }
  >({ status: "loading" });

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/report?token=${encodeURIComponent(token)}`, {
        cache: "no-store",
      });
      if (res.status === 403) {
        setState({ status: "error", message: "This report link isn't valid for you." });
        return;
      }
      if (!res.ok) {
        setState({ status: "error", message: "We couldn't load your report just yet." });
        return;
      }
      const data = await res.json();
      if (data.ready) setState({ status: "ready", report: data.report });
      else setState({ status: "waiting", you: data.youSubmitted, partner: data.partnerSubmitted });
    } catch {
      setState({ status: "error", message: "Network hiccup — trying again shortly." });
    }
  }, [sessionId, token]);

  useEffect(() => {
    load();
    const t = setInterval(load, 6000); // poll while waiting
    return () => clearInterval(t);
  }, [load]);

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="container">
      <div className="brand-row">
        <div className="logo">♥</div>
        <span>Two Hearts</span>
      </div>
      {children}
    </div>
  );

  if (state.status === "loading") {
    return (
      <Shell>
        <div className="card">
          <p className="muted">Loading your report…</p>
        </div>
      </Shell>
    );
  }

  if (state.status === "error") {
    return (
      <Shell>
        <div className="card">
          <h2>Hmm.</h2>
          <p className="muted">{state.message}</p>
        </div>
      </Shell>
    );
  }

  if (state.status === "waiting") {
    return (
      <Shell>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40 }}>⏳</div>
          <h2>Almost there</h2>
          <p className="muted">
            Your report unlocks once you've both submitted. Your answers stay
            private either way.
          </p>
          <div className="list" style={{ maxWidth: 320, margin: "18px auto 0" }}>
            <div className="qitem row between">
              <span>You</span>
              {state.you ? <span className="tag green">Done</span> : <span className="tag amber">In progress</span>}
            </div>
            <div className="qitem row between">
              <span>Your partner</span>
              {state.partner ? <span className="tag green">Done</span> : <span className="tag amber">In progress</span>}
            </div>
          </div>
          <p className="small muted" style={{ marginTop: 16 }}>
            This page checks automatically — leave it open, or come back later.
          </p>
        </div>
      </Shell>
    );
  }

  const r = state.report;
  return (
    <Shell>
      <h1 style={{ marginBottom: 4 }}>Your compatibility report</h1>
      <p className="lead">Where you two align, and what's worth a conversation.</p>

      <div className="card" style={{ textAlign: "center" }}>
        <div className="ring" style={{ ["--p" as any]: r.overallPct }}>
          <div>
            <div className="num">{r.overallPct}%</div>
            <div className="small muted">overall alignment</div>
          </div>
        </div>
        <p className="muted" style={{ marginTop: 16, marginBottom: 0 }}>
          This isn't a grade — it's a map. A lower score just means more good
          conversations ahead of you.
        </p>
      </div>

      {r.strengths.length > 0 && (
        <div className="card">
          <h2>💚 Where you're strong</h2>
          <p className="muted" style={{ marginTop: 0 }}>
            You see eye to eye on {r.strengths.join(", ")}.
          </p>
        </div>
      )}

      {r.talkAbout.length > 0 && (
        <div className="card">
          <h2>💬 Worth talking about</h2>
          <p className="muted" style={{ marginTop: 0 }}>
            You answered these differently. That's normal — these are just the
            conversations worth having before the big day.
          </p>
          <div className="list">
            {r.talkAbout.map((t, i) => (
              <div key={i} className="qitem">{t}</div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2>By topic</h2>
        <p className="muted small" style={{ marginTop: 0 }}>
          Tap a topic to see each question and whether you aligned. You'll only
          ever see <em>your own</em> answers — never your partner's.
        </p>
        {r.categories.map((c) => (
          <CategoryBlock key={c.category.id} c={c} />
        ))}
      </div>

      <p className="footer">
        Two Hearts is a conversation starter, not a diagnosis or a substitute for
        counseling. Be gentle with each other.
      </p>
    </Shell>
  );
}

function CategoryBlock({ c }: { c: CategoryResult }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ margin: "16px 0" }}>
      <div className="row between" style={{ cursor: "pointer" }} onClick={() => setOpen((o) => !o)}>
        <div>
          <strong>{c.category.title}</strong>
          <div className="small muted">
            {c.answered < c.total ? `${c.answered}/${c.total} answered · ` : ""}
            {c.alignmentPct}% aligned
          </div>
        </div>
        <span className="small muted">{open ? "▲" : "▼"}</span>
      </div>
      <div className="bar" style={{ marginTop: 8 }}>
        <span style={{ width: `${c.alignmentPct}%`, background: barColor(c.alignmentPct) }} />
      </div>
      {open && (
        <div className="list" style={{ marginTop: 12 }}>
          {c.results.map((q) => (
            <div key={q.id} className="qitem">
              <div className="row between" style={{ alignItems: "flex-start", gap: 12 }}>
                <span>{q.text}</span>
                <AlignTag a={q.alignment} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
