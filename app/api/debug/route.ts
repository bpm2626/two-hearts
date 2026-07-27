import { NextResponse } from "next/server";
import { storageMode } from "@/lib/store";

export const dynamic = "force-dynamic";

// TEMPORARY diagnostic endpoint. Returns whether the app sees the database,
// and the NAMES (not values) of relevant env vars. Safe to expose briefly;
// remove after confirming storage works.
export async function GET() {
  const names = Object.keys(process.env)
    .filter((k) => /(KV|REDIS|UPSTASH|REST_API)/i.test(k))
    .sort();
  return NextResponse.json({
    storage: storageMode(), // "redis" = good, "memory" = not reading DB
    matchingEnvVarNames: names,
  });
}
