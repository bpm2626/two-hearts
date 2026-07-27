import { Question, getQuestions, CATEGORIES, Category } from "./questions";
import { Answers, Session, PartnerKey } from "./types";

// ---------------------------------------------------------------------------
// Privacy-preserving comparison.
//
// The report NEVER contains the other partner's raw answers. For each question
// we only compute an alignment status. The viewer sees their own answer (which
// they gave), plus whether the two of them are aligned — and for gaps, a
// prompt to discuss. The partner's specific choice is never revealed.
// ---------------------------------------------------------------------------

export type Alignment = "aligned" | "slight" | "gap" | "incomplete";

export interface QuestionResult {
  id: string;
  category: string;
  text: string;
  alignment: Alignment;
  yourAnswerIndex: number | null; // shown only to the answer's owner
  distance: number | null; // 0..4, absolute difference; null if incomplete
}

export interface CategoryResult {
  category: Category;
  alignmentPct: number; // 0..100
  answered: number;
  total: number;
  results: QuestionResult[];
}

export interface Report {
  overallPct: number;
  categories: CategoryResult[];
  strengths: string[]; // category titles with high alignment
  talkAbout: string[]; // question texts with the biggest gaps
  bothSubmitted: boolean;
}

function classify(distance: number): Alignment {
  if (distance <= 0) return "aligned";
  if (distance === 1) return "slight";
  return "gap";
}

// alignment score contribution per question: 1.0 aligned, 0.6 slight, 0 gap.
function score(alignment: Alignment): number {
  if (alignment === "aligned") return 1;
  if (alignment === "slight") return 0.6;
  return 0;
}

export function buildReport(session: Session, viewer: PartnerKey): Report {
  const questions = getQuestions(session.communityId);
  const a = session.partners.a.answers;
  const b = session.partners.b.answers;
  const mine = session.partners[viewer].answers;

  const byCategory = new Map<string, QuestionResult[]>();

  for (const q of questions) {
    const av = a[q.id];
    const bv = b[q.id];
    const hasBoth = av !== undefined && bv !== undefined;
    const distance = hasBoth ? Math.abs(av - bv) : null;
    const alignment: Alignment = hasBoth ? classify(distance as number) : "incomplete";

    const result: QuestionResult = {
      id: q.id,
      category: q.category,
      text: q.text,
      alignment,
      yourAnswerIndex: mine[q.id] ?? null,
      distance,
    };
    const arr = byCategory.get(q.category) ?? [];
    arr.push(result);
    byCategory.set(q.category, arr);
  }

  const categories: CategoryResult[] = [];
  for (const cat of CATEGORIES) {
    const results = byCategory.get(cat.id) ?? [];
    if (results.length === 0) continue;
    const scored = results.filter((r) => r.alignment !== "incomplete");
    const total = results.length;
    const answered = scored.length;
    const alignmentPct =
      scored.length === 0
        ? 0
        : Math.round(
            (scored.reduce((s, r) => s + score(r.alignment), 0) / scored.length) * 100
          );
    categories.push({ category: cat, alignmentPct, answered, total, results });
  }

  const allScored = categories.flatMap((c) =>
    c.results.filter((r) => r.alignment !== "incomplete")
  );
  const overallPct =
    allScored.length === 0
      ? 0
      : Math.round(
          (allScored.reduce((s, r) => s + score(r.alignment), 0) / allScored.length) *
            100
        );

  const strengths = categories
    .filter((c) => c.answered > 0 && c.alignmentPct >= 80)
    .sort((x, y) => y.alignmentPct - x.alignmentPct)
    .slice(0, 3)
    .map((c) => c.category.title);

  const talkAbout = allScored
    .filter((r) => r.alignment === "gap")
    .sort((x, y) => (y.distance ?? 0) - (x.distance ?? 0))
    .slice(0, 6)
    .map((r) => r.text);

  return {
    overallPct,
    categories,
    strengths,
    talkAbout,
    bothSubmitted: session.partners.a.submitted && session.partners.b.submitted,
  };
}
