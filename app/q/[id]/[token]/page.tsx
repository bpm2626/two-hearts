import Link from "next/link";
import { getSession } from "@/lib/store";
import { partnerFromToken } from "@/lib/types";
import { getQuestions, getCommunity } from "@/lib/questions";
import Questionnaire from "./Questionnaire";

export const dynamic = "force-dynamic";

export default async function QuestionnairePage({
  params,
}: {
  params: { id: string; token: string };
}) {
  const session = await getSession(params.id);

  if (!session) {
    return (
      <div className="container">
        <div className="brand-row">
          <div className="logo">♥</div>
          <span>Two Hearts</span>
        </div>
        <div className="card">
          <h2>We couldn't find this questionnaire</h2>
          <p className="muted">
            The link may be mistyped or expired. Ask your partner to resend it, or{" "}
            <Link href="/">start a new one</Link>.
          </p>
        </div>
      </div>
    );
  }

  const who = partnerFromToken(session, params.token);
  if (!who) {
    return (
      <div className="container">
        <div className="brand-row">
          <div className="logo">♥</div>
          <span>Two Hearts</span>
        </div>
        <div className="card">
          <h2>This link isn't valid</h2>
          <p className="muted">
            Please use the exact private link you were given. Each person has their
            own.
          </p>
        </div>
      </div>
    );
  }

  const community = getCommunity(session.communityId);
  const questions = getQuestions(session.communityId);
  const myAnswers = session.partners[who].answers;
  const submitted = session.partners[who].submitted;

  return (
    <Questionnaire
      sessionId={session.id}
      token={params.token}
      communityName={community.name}
      questions={questions}
      initialAnswers={myAnswers}
      alreadySubmitted={submitted}
    />
  );
}
