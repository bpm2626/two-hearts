import { COMMUNITIES } from "@/lib/questions";
import StartFlow from "./StartFlow";

export default function Home() {
  return (
    <div className="container">
      <div className="brand-row">
        <div className="logo">♥</div>
        <span>Two Hearts</span>
      </div>

      <h1>Talk about the big things — privately.</h1>
      <p className="lead">
        A gentle pre-marriage questionnaire for couples. You each answer on your
        own, honestly. Your partner never sees your answers — only a shared
        report that shows where you align and what's worth a conversation.
      </p>

      <div className="card">
        <div className="pill">🔒 Your answers stay yours</div>
        <p style={{ marginTop: 14, marginBottom: 0 }} className="muted">
          Neither of you can read the other's individual responses. The report
          only ever says <em>“you two align here”</em> or <em>“this one's worth
          talking about”</em> — never <em>what</em> your partner picked. It's built
          to make honesty safe, especially when family, faith, and tradition are
          part of the picture.
        </p>
      </div>

      <StartFlow communities={COMMUNITIES.map((c) => ({ id: c.id, name: c.name, tagline: c.tagline }))} />

      <div className="card">
        <h2>How it works</h2>
        <ol className="muted" style={{ paddingLeft: 18, marginBottom: 0 }}>
          <li>You start a questionnaire and get a private link to send your partner.</li>
          <li>You each answer separately, whenever you have quiet time.</li>
          <li>When you've both finished, you each get the same compatibility report.</li>
        </ol>
      </div>

      <p className="footer">
        Two Hearts is a conversation starter, not a substitute for counseling. If
        something feels heavy, a trusted counselor, elder, or faith leader can help.
      </p>
    </div>
  );
}
