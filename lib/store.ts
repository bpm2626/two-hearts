import { Session } from "./types";

// ---------------------------------------------------------------------------
// Pluggable storage.
//
// - Local dev (`npm run dev`): an in-memory Map is used automatically. This is
//   perfect for trying the full two-partner flow in two browser tabs.
// - Production (Vercel serverless): memory does NOT persist across requests, so
//   you must connect a Redis/KV store. We talk to Upstash Redis over its REST
//   API using env vars that Vercel injects when you add "Upstash for Redis"
//   from the Marketplace (KV_REST_API_URL / KV_REST_API_TOKEN), or the native
//   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN.
// ---------------------------------------------------------------------------

const REST_URL =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const REST_TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

const useRedis = Boolean(REST_URL && REST_TOKEN);

// Sessions expire after 30 days of inactivity.
const TTL_SECONDS = 60 * 60 * 24 * 30;

const key = (id: string) => `session:${id}`;

// --- In-memory fallback (dev only) -----------------------------------------
// Use a global so the map survives hot-reloads in `next dev`.
const g = globalThis as unknown as { __twoHeartsMem?: Map<string, Session> };
const mem = g.__twoHeartsMem ?? (g.__twoHeartsMem = new Map<string, Session>());

async function redisCmd(command: (string | number)[]): Promise<any> {
  const res = await fetch(REST_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`KV request failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.result;
}

export async function getSession(id: string): Promise<Session | null> {
  if (!useRedis) return mem.get(id) ?? null;
  const raw = await redisCmd(["GET", key(id)]);
  return raw ? (JSON.parse(raw) as Session) : null;
}

export async function saveSession(session: Session): Promise<void> {
  if (!useRedis) {
    mem.set(session.id, session);
    return;
  }
  await redisCmd(["SET", key(session.id), JSON.stringify(session), "EX", TTL_SECONDS]);
}

export function storageMode(): "redis" | "memory" {
  return useRedis ? "redis" : "memory";
}
