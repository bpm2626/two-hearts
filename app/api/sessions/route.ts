import { NextRequest, NextResponse } from "next/server";
import { getSession, saveSession } from "@/lib/store";
import { newId } from "@/lib/id";
import { getCommunity } from "@/lib/questions";
import { Session } from "@/lib/types";

export const dynamic = "force-dynamic";

// Create a new couple session. The creator becomes partner "a".
export async function POST(req: NextRequest) {
  let body: { communityId?: string } = {};
  try {
    body = await req.json();
  } catch {
    // no body is fine
  }
  const community = getCommunity(body.communityId);

  const id = newId(8);
  const session: Session = {
    id,
    communityId: community.id,
    createdAt: Date.now(),
    partners: {
      a: { token: newId(12), answers: {}, submitted: false },
      b: { token: newId(12), answers: {}, submitted: false },
    },
  };
  await saveSession(session);

  return NextResponse.json({
    sessionId: id,
    communityId: community.id,
    selfToken: session.partners.a.token, // for the creator (partner A)
    partnerToken: session.partners.b.token, // embedded in the invite link
  });
}

// Lightweight status lookup (does not leak answers).
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  const session = await getSession(id);
  if (!session) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({
    sessionId: session.id,
    communityId: session.communityId,
    aSubmitted: session.partners.a.submitted,
    bSubmitted: session.partners.b.submitted,
  });
}
