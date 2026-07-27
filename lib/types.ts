export type PartnerKey = "a" | "b";

// Answers map question id -> selected index (0..4).
export type Answers = Record<string, number>;

export interface PartnerState {
  token: string;
  answers: Answers;
  submitted: boolean;
}

export interface Session {
  id: string;
  communityId: string;
  createdAt: number;
  partners: Record<PartnerKey, PartnerState>;
}

export function partnerFromToken(session: Session, token: string): PartnerKey | null {
  if (session.partners.a.token === token) return "a";
  if (session.partners.b.token === token) return "b";
  return null;
}
