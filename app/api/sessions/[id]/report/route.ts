import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/store";
import { partnerFromToken } from "@/lib/types";
import { buildReport } from "@/lib/compare";

export const dynamic = "force-dynamic";

// Return the aggregated report for the requesting partner.
// The partner's own token is required; the other partner's raw answers are
// never included in the response.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(params.id);
  if (!session) return NextResponse.json({ error: "not found" }, { status: 404 });

  const token = req.nextUrl.searchParams.get("token") ?? "";
  const who = partnerFromToken(session, token);
  if (!who) return NextResponse.json({ error: "invalid token" }, { status: 403 });

  const bothSubmitted =
    session.partners.a.submitted && session.partners.b.submitted;

  if (!bothSubmitted) {
    return NextResponse.json({
      ready: false,
      youSubmitted: session.partners[who].submitted,
      partnerSubmitted: session.partners[who === "a" ? "b" : "a"].submitted,
    });
  }

  const report = buildReport(session, who);
  return NextResponse.json({ ready: true, report });
}
