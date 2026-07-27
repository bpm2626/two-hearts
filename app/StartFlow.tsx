"use client";

import { useState } from "react";

interface CommunityLite {
  id: string;
  name: string;
  tagline: string;
}

export default function StartFlow({ communities }: { communities: CommunityLite[] }) {
  const [communityId, setCommunityId] = useState(communities[0]?.id ?? "general");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    sessionId: string;
    selfToken: string;
    partnerToken: string;
  }>(null);
  const [copied, setCopied] = useState(false);

  async function start() {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ communityId }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const partnerLink = `${origin}/q/${result.sessionId}/${result.partnerToken}`;
    const myLink = `${origin}/q/${result.sessionId}/${result.selfToken}`;
    return (
      <div className="card">
        <h2>Your questionnaire is ready 🎉</h2>
        <p className="muted">First, send this private link to your partner:</p>
        <div className="copybox">
          <input className="field" readOnly value={partnerLink} />
          <button
            className="btn secondary"
            onClick={() => {
              navigator.clipboard?.writeText(partnerLink);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="small muted" style={{ marginTop: 8 }}>
          Only your partner should use this link. Whoever opens it becomes the
          second person in this questionnaire.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid var(--line)", margin: "20px 0" }} />

        <p className="muted">Then start yours:</p>
        <a className="btn block" href={myLink}>
          Begin my questionnaire →
        </a>
        <p className="small muted" style={{ marginTop: 12 }}>
          Tip: bookmark your link — it's how you return to your answers and, later,
          your report.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Start a questionnaire</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        Choose the set that fits you both. You can always start over with a
        different one.
      </p>
      <div className="choices">
        {communities.map((c) => (
          <div
            key={c.id}
            className={`choice ${communityId === c.id ? "selected" : ""}`}
            onClick={() => setCommunityId(c.id)}
          >
            <span className="dot" />
            <span>
              <strong>{c.name}</strong>
              <br />
              <span className="small muted">{c.tagline}</span>
            </span>
          </div>
        ))}
      </div>
      <button className="btn block" style={{ marginTop: 18 }} onClick={start} disabled={loading}>
        {loading ? "Setting up…" : "Create our questionnaire"}
      </button>
    </div>
  );
}
