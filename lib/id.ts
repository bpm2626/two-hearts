import { randomBytes } from "crypto";

// URL-safe short id.
export function newId(bytes = 9): string {
  return randomBytes(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
