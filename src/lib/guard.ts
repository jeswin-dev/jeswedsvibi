/** Small safeguards for the two public write endpoints. */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/** In-memory is enough at family-invitation traffic; no external store needed. */
export function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);
  return false;
}

const BANNED = [
  "fuck",
  "shit",
  "bitch",
  "bastard",
  "asshole",
  "cunt",
  "dick",
  "porn",
  "sex",
  "whore",
  "slut",
  "rape",
  "nigger",
  "faggot",
];

/**
 * Wishes publish instantly, so anything that reaches the page is stripped of
 * markup and links first, and obvious abuse is refused outright.
 */
export function sanitize(input: string) {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/www\.\S+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function containsAbuse(input: string) {
  const haystack = input.toLowerCase();
  return BANNED.some((word) => new RegExp(`\\b${word}`, "i").test(haystack));
}
