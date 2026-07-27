// ---------------------------------------------------------------------------
// Question sets + configurable "communities".
//
// The core set is broadly inclusive. A "community" is a config layer that can
// add questions, hide questions, or relabel the experience so the same engine
// can be adapted to many minority / cultural / faith groups without changing
// any application code. To add a community, add an entry to COMMUNITIES below.
// ---------------------------------------------------------------------------

export type QuestionType = "scale" | "choice";

export interface Question {
  id: string;
  category: string;
  text: string;
  type: QuestionType;
  // For "scale": a 1..5 Likert (Strongly disagree .. Strongly agree).
  // For "choice": explicit options.
  options?: string[];
  // Optional helper shown under the question.
  help?: string;
}

export interface Category {
  id: string;
  title: string;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  { id: "values", title: "Values & Identity", blurb: "What matters most and how you each see yourselves." },
  { id: "family", title: "Family & Community", blurb: "Extended family, traditions, and expectations around you." },
  { id: "wedding", title: "The Wedding Itself", blurb: "Size, budget, and how much the celebration should reflect expectations." },
  { id: "faith", title: "Faith & Tradition", blurb: "Belief, practice, and how tradition shows up at home." },
  { id: "children", title: "Children & Parenting", blurb: "Whether, when, and how you'd raise a family." },
  { id: "money", title: "Money & Work", blurb: "Earning, spending, saving, and career expectations." },
  { id: "roles", title: "Roles & Home Life", blurb: "How you'd divide responsibilities and decisions." },
  { id: "intimacy", title: "Closeness & Intimacy", blurb: "Affection, needs, and expectations of togetherness." },
  { id: "conflict", title: "Conflict & Communication", blurb: "How you handle disagreement and repair." },
  { id: "future", title: "Future & Home", blurb: "Where and how you picture your life together." },
];

// The broadly-inclusive base question bank.
export const BASE_QUESTIONS: Question[] = [
  // Values & Identity
  { id: "val_1", category: "values", type: "scale", text: "It's important to me that we share the same core values, even if our backgrounds differ." },
  { id: "val_2", category: "values", type: "scale", text: "I feel free to be fully myself around my partner." },
  { id: "val_3", category: "values", type: "choice", text: "How much does preserving my cultural identity matter within our marriage?", options: ["Not important", "Somewhat", "Important", "Very important", "Essential"] },
  { id: "val_4", category: "values", type: "scale", text: "We should be able to disagree about beliefs and still respect each other." },

  // Family & Community
  { id: "fam_1", category: "family", type: "scale", text: "My extended family's approval of our marriage matters to me." },
  { id: "fam_2", category: "family", type: "choice", text: "How involved should extended family be in our day-to-day decisions?", options: ["Not involved", "Rarely", "Sometimes", "Often", "Very involved"] },
  { id: "fam_3", category: "family", type: "scale", text: "I would be comfortable living near or with extended family if needed." },
  { id: "fam_4", category: "family", type: "scale", text: "Keeping our community's traditions alive in our home is important to me." },
  { id: "fam_5", category: "family", type: "choice", text: "If our families disagreed with a decision we made together, I would want us to:", options: ["Always defer to family", "Usually defer to family", "Decide together, weigh family", "Mostly decide as a couple", "Fully decide as a couple"] },

  // The Wedding Itself
  { id: "wed_1", category: "wedding", type: "scale", text: "Having a large wedding that lives up to our community's expectations is important to me.", help: "Some cultures place real weight on a big, celebrated wedding — be honest about how much that matters to you." },
  { id: "wed_2", category: "wedding", type: "choice", text: "What kind of wedding do I actually want?", options: ["Very small & intimate", "Small", "Medium", "Large", "As big as possible"] },
  { id: "wed_3", category: "wedding", type: "choice", text: "How many guests would I consider a \"big\" wedding?", options: ["Under 100", "100–250", "250–500", "500–1,000", "1,000+"] },
  { id: "wed_4", category: "wedding", type: "choice", text: "What should our wedding budget be — not including jewelry and gifts?", options: ["$50k–$150k", "$150k–$300k", "$300k–$450k", "$450k–$600k", "$600k+"] },
  { id: "wed_5", category: "wedding", type: "choice", text: "How many separate events or parties should the wedding include?", options: ["Just one", "2", "3", "4–5", "More than 5"] },
  { id: "wed_6", category: "wedding", type: "scale", text: "It's okay to spend less or go smaller than others expect, if a simpler celebration is right for us." },
  { id: "wed_7", category: "wedding", type: "scale", text: "Who pays for the wedding — us, our families, or a mix — is something we clearly agree on." },

  // Faith & Tradition
  { id: "fth_1", category: "faith", type: "choice", text: "How central is faith or spiritual practice to my daily life?", options: ["Not at all", "A little", "Moderately", "Very", "Central"] },
  { id: "fth_2", category: "faith", type: "scale", text: "We should share the same religious or spiritual practice at home." },
  { id: "fth_3", category: "faith", type: "scale", text: "I'm comfortable with my partner practicing differently than I do." },
  { id: "fth_4", category: "faith", type: "choice", text: "How should religious holidays and traditions be observed in our home?", options: ["Not observed", "Casually", "Some of them fully", "Most of them fully", "All of them fully"] },

  // Children & Parenting
  { id: "chd_1", category: "children", type: "choice", text: "Do I want to have children?", options: ["No", "Probably not", "Unsure", "Probably yes", "Yes"] },
  { id: "chd_2", category: "children", type: "choice", text: "If we have children, how should they be raised regarding faith/culture?", options: ["No particular tradition", "Exposed to both, choose later", "Primarily one tradition", "Strictly one tradition", "We need to discuss"] },
  { id: "chd_3", category: "children", type: "scale", text: "Passing our language or heritage to our children is important to me." },
  { id: "chd_4", category: "children", type: "choice", text: "My preferred approach to parenting discipline is:", options: ["Very relaxed", "Relaxed", "Balanced", "Structured", "Very structured"] },

  // Money & Work
  { id: "mny_1", category: "money", type: "choice", text: "How should we handle finances as a couple?", options: ["Fully separate", "Mostly separate", "Mix of both", "Mostly shared", "Fully shared"] },
  { id: "mny_2", category: "money", type: "scale", text: "Both partners should contribute financially where possible." },
  { id: "mny_3", category: "money", type: "choice", text: "My attitude toward money is closer to:", options: ["Save every bit", "Cautious saver", "Balanced", "Comfortable spender", "Live for today"] },
  { id: "mny_4", category: "money", type: "scale", text: "Supporting extended family financially is a shared responsibility." },
  { id: "mny_5", category: "money", type: "scale", text: "Big purchases should always be decided together." },

  // Roles & Home Life
  { id: "rol_1", category: "roles", type: "choice", text: "How should household responsibilities be divided?", options: ["Traditional roles", "Mostly traditional", "Shared/flexible", "Whoever has time", "Fully equal split"] },
  { id: "rol_2", category: "roles", type: "scale", text: "Both partners should have equal say in major decisions." },
  { id: "rol_3", category: "roles", type: "scale", text: "It's fine for either partner to be the primary earner." },
  { id: "rol_4", category: "roles", type: "choice", text: "If one partner needed to pause their career for family, that should be:", options: ["Always the same partner", "Usually one partner", "Whoever we decide", "Shared over time", "Neither should have to"] },

  // Closeness & Intimacy
  { id: "int_1", category: "intimacy", type: "scale", text: "I need regular quality time alone with my partner to feel connected." },
  { id: "int_2", category: "intimacy", type: "choice", text: "How openly do I want to talk about intimacy and needs?", options: ["Very privately", "Rarely", "When needed", "Openly", "Very openly"] },
  { id: "int_3", category: "intimacy", type: "scale", text: "Physical affection is an important way I give and receive love." },
  { id: "int_4", category: "intimacy", type: "scale", text: "I'm comfortable talking with my partner about expectations before marriage." },

  // Conflict & Communication
  { id: "cnf_1", category: "conflict", type: "choice", text: "When we disagree, my instinct is to:", options: ["Withdraw and cool off", "Avoid the topic", "Talk it through soon", "Address it right away", "Involve a trusted person"] },
  { id: "cnf_2", category: "conflict", type: "scale", text: "It's healthy to bring in a counselor or elder when we're stuck." },
  { id: "cnf_3", category: "conflict", type: "scale", text: "I find it easy to apologize and repair after a fight." },
  { id: "cnf_4", category: "conflict", type: "scale", text: "I can express what I need without fear of my partner's reaction." },

  // Future & Home
  { id: "fut_1", category: "future", type: "choice", text: "Where do I picture us building our life?", options: ["Near my family", "Near their family", "A new place together", "Wherever work takes us", "Open to anywhere"] },
  { id: "fut_2", category: "future", type: "scale", text: "Being open to relocating for opportunity is important to me." },
  { id: "fut_3", category: "future", type: "scale", text: "We share a similar vision of what a happy life looks like in 10 years." },
];

// ---------------------------------------------------------------------------
// Communities: config overlays on top of the base bank.
// ---------------------------------------------------------------------------
export interface Community {
  id: string;
  name: string;
  tagline: string;
  // Question ids to exclude from the base set (optional).
  hide?: string[];
  // Extra questions specific to this community (optional).
  extra?: Question[];
}

export const COMMUNITIES: Community[] = [
  {
    id: "general",
    name: "General (inclusive)",
    tagline: "A broadly inclusive set for any couple.",
  },
  {
    id: "faith-forward",
    name: "Faith-centered",
    tagline: "Adds questions for couples where shared faith practice is central.",
    extra: [
      { id: "ff_1", category: "faith", type: "scale", text: "Praying or worshipping together regularly is important to me." },
      { id: "ff_2", category: "faith", type: "choice", text: "How should religious guidance shape major life decisions?", options: ["Not at all", "A little", "Somewhat", "Significantly", "It should lead"] },
      { id: "ff_3", category: "faith", type: "scale", text: "Our children should be raised primarily within our faith community." },
    ],
  },
  {
    id: "intercultural",
    name: "Intercultural couple",
    tagline: "Adds questions for couples blending two cultures or heritages.",
    extra: [
      { id: "ic_1", category: "values", type: "scale", text: "We should intentionally blend both of our cultures at home." },
      { id: "ic_2", category: "family", type: "choice", text: "When our two families' expectations conflict, we should:", options: ["Follow mine", "Lean toward mine", "Find a middle path", "Lean toward theirs", "Follow theirs"] },
      { id: "ic_3", category: "children", type: "scale", text: "Our children should be fluent in both of our languages." },
      { id: "ic_4", category: "future", type: "choice", text: "How often should we visit each side's home country/region?", options: ["Rarely", "Occasionally", "Regularly", "Often", "As much as possible"] },
    ],
  },
];

export function getCommunity(id: string | undefined | null): Community {
  return COMMUNITIES.find((c) => c.id === id) ?? COMMUNITIES[0];
}

// Build the effective question list for a community.
export function getQuestions(communityId: string): Question[] {
  const community = getCommunity(communityId);
  const hide = new Set(community.hide ?? []);
  const base = BASE_QUESTIONS.filter((q) => !hide.has(q.id));
  const extra = community.extra ?? [];
  return [...base, ...extra];
}

export const SCALE_LABELS = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree",
];
