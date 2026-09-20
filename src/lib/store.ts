import { randomUUID } from "node:crypto";

/**
 * Upstash Redis over its REST API — no SDK, because two commands do not justify
 * a dependency. Vercel's Upstash integration injects these variables itself;
 * the KV_* names are the same service under Vercel's older naming.
 */
const endpoint = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

/** False before the store is connected, so the site can degrade politely. */
export function storeConfigured() {
  return Boolean(endpoint && token);
}

async function command<T>(args: (string | number)[]): Promise<T> {
  if (!endpoint || !token) throw new Error("Redis is not configured");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Redis ${args[0]} failed: ${response.status} ${await response.text()}`);
  }

  const body = (await response.json()) as { result: T };
  return body.result;
}

/**
 * Entries live as fields of a hash rather than items of a list, because a hash
 * field is the one thing you can delete individually from the Upstash data
 * browser — which is how wishes get moderated.
 */
export const KEYS = { wishes: "wishes", rsvps: "rsvps" } as const;

/** Time-prefixed so the id sorts chronologically and never collides. */
function newId() {
  return `${Date.now()}-${randomUUID().slice(0, 8)}`;
}

export async function putEntry(key: string, value: Record<string, unknown>) {
  const id = newId();
  await command(["HSET", key, id, JSON.stringify({ id, ...value })]);
  return id;
}

export async function listEntries<T>(key: string): Promise<T[]> {
  // HGETALL comes back as a flat [field, value, field, value, …] array.
  const flat = await command<string[] | null>(["HGETALL", key]);
  if (!flat?.length) return [];

  const entries: T[] = [];
  for (let index = 1; index < flat.length; index += 2) {
    try {
      entries.push(JSON.parse(flat[index]) as T);
    } catch {
      // A hand-edited field in the dashboard should not break the whole wall.
    }
  }

  return entries;
}

/**
 * Rate limiting in Redis rather than in memory: serverless instances come and
 * go, so an in-process counter is trivially bypassed.
 */
export async function rateLimitedInRedis(key: string, limit: number, windowSeconds: number) {
  if (!storeConfigured()) return false;

  try {
    const count = await command<number>(["INCR", `rate:${key}`]);
    if (count === 1) await command(["EXPIRE", `rate:${key}`, windowSeconds]);
    return count > limit;
  } catch {
    // Never block a guest because the limiter itself failed.
    return false;
  }
}
