import { NextRequest, NextResponse } from "next/server";
import { getSession, saveSession } from "@/lib/store";
import { partnerFromToken } from "@/lib/types";
import { getQuestions } from "@/lib/questions";

export const dynamic = "force-dynamic";

// Save (or update) a partner's answers. Requires the partner's private token.
// Body: { token: string, answers: Record<string, number>, submit?: boolean }
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(params.id);
  if (!session) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body.token !== "string") {
    return NextResponse.json({ error: "missing token" }, { status: 400 });
  }
  const who = partnerFromToken(session, body.token);
  if (!who) return NextResponse.json({ error: "invalid token" }, { status: 403 });

  const validIds = new Set(getQuestions(session.communityId).map((q) => q.id));
  const incoming = (body.answers ?? {}) as Record<string, unknown>;
  const clean: Record<string, number> = {};
  for (const [qid, val] of Object.entries(incoming)) {
    if (validIds.has(qid) && typeof val === "number" && val >= 0 && val <= 4) {
      clean[qid] = Math.round(val);
    }
  }

  session.partners[who].answers = { ...session.partners[who].answers, ...clean };
  if (body.submit === true) session.partners[who].submitted = true;
  await saveSession(session);

  return NextResponse.json({
    ok: true,
    submitted: session.partners[who].submitted,
    saved: Object.keys(session.partners[who].answers).length,
  });
}
