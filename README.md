# Two Hearts 💜

A private pre-marriage questionnaire for couples. Each partner answers on their
own; **neither person ever sees the other's individual answers.** When both are
done, each partner gets the same compatibility report showing *where you align*
and *what's worth talking about* — never *what* the other person chose.

Built to make honesty feel safe, with a configurable question layer so it can be
tailored to different communities (faith-centered, intercultural, and more).

Stack: **Next.js 14 (App Router) + TypeScript**, no CSS framework, deploys to
**Vercel** in a couple of minutes.

---

## The privacy model

This is the heart of the app, so it's worth being precise:

- Each partner has their own **private link** (`/q/<session>/<token>`). The token
  is a random secret that identifies which partner you are.
- Raw answers are stored **server-side only**. They are never sent to the other
  partner's browser.
- The report endpoint computes an **aggregate** on the server and returns, per
  question, only an *alignment status* (`aligned` / `close` / `worth talking
  about`) plus **your own** answer. The other person's specific choice is never
  in the response payload.

You can confirm this yourself: open the browser network tab on the report page —
the JSON contains `yourAnswerIndex` for your questions and a `distance` number,
but no field ever carries your partner's selected option.

---

## Run it locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

In local dev the app uses an **in-memory store**, so you can try the whole flow
with two browser tabs:

1. On the home page, create a questionnaire → copy the **partner link**.
2. Open that partner link in a second tab (or an incognito window) — that's
   partner B.
3. Answer in both, submit both, then open the report link from either.

> Note: the in-memory store is per-process and resets on restart. That's fine for
> local testing but **not** for production (see below).

---

## Deploy to GitHub + Vercel

### 1. Push to GitHub

```bash
cd twohearts
git init
git add .
git commit -m "Two Hearts: private pre-marriage questionnaire"
git branch -M main
git remote add origin https://github.com/<you>/twohearts.git
git push -u origin main
```

### 2. Import into Vercel

- Go to [vercel.com/new](https://vercel.com/new), import the repo. Framework is
  auto-detected as **Next.js** — no build settings to change.

### 3. Add a database (required in production)

Vercel serverless functions don't keep memory between requests, so you must
connect a small key/value store. Easiest path:

- In your Vercel project: **Storage → Create Database → Upstash for Redis**
  (from the Marketplace). It's free to start.
- Vercel automatically injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` into
  your project. The app picks these up with **no code changes**.
- Redeploy. Done.

Prefer Upstash directly? Set `UPSTASH_REDIS_REST_URL` and
`UPSTASH_REDIS_REST_TOKEN` instead — the app reads either naming.

See `.env.example` for the full list.

---

## Customizing the questions & communities

Everything lives in [`lib/questions.ts`](lib/questions.ts):

- **`BASE_QUESTIONS`** — the broadly-inclusive question bank, grouped by category.
  Each question is a 1–5 scale or a multiple-choice.
- **`COMMUNITIES`** — config overlays. A community can `hide` base questions and
  add `extra` ones. Two examples ship: *Faith-centered* and *Intercultural
  couple*. Add your own by appending to the array — no other code changes needed.

```ts
{
  id: "my-community",
  name: "My community",
  tagline: "What this set is for.",
  extra: [
    { id: "mc_1", category: "family", type: "scale",
      text: "A question specific to this community." },
  ],
}
```

Categories are defined in `CATEGORIES` in the same file.

---

## Project layout

```
app/
  page.tsx                      Landing + start flow
  StartFlow.tsx                 Create a session, get invite link (client)
  q/[id]/[token]/               Private questionnaire for one partner
  report/[id]/[token]/          Compatibility report (privacy-preserving)
  api/sessions/                 Create session
  api/sessions/[id]/answer/     Save a partner's answers (token-gated)
  api/sessions/[id]/report/     Aggregated report (token-gated, no raw leak)
lib/
  questions.ts                  Question bank + configurable communities
  compare.ts                    Alignment/report computation
  store.ts                      Storage (in-memory dev / Redis prod)
  types.ts, id.ts               Types and id helpers
```

---

## Good to know / next steps

This is an MVP focused on validating the flow and the questions. Natural next
steps when you're ready:

- **Accounts & auth** — right now access is by secret link (which is simple and
  private, but anyone with the link can view). Add real logins if you want
  recovery and stronger guarantees.
- **Free-text reflections** — a private "note to self" per question that's never
  compared or shared.
- **Facilitator view** — an optional counselor/elder role, if you later want the
  "a trusted third party sees the report" model.
- **More communities** — build out tailored sets with input from each community.

Two Hearts is a conversation starter, not a diagnosis or a substitute for
counseling.
