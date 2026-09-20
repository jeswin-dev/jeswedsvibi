import { NextResponse } from "next/server";

import { clientIp, containsAbuse, rateLimited, sanitize } from "@/lib/guard";
import type { Wish } from "@/lib/schemas";
import { wishSchema } from "@/lib/schemas";
import { KEYS, listEntries, putEntry, rateLimitedInRedis, storeConfigured } from "@/lib/store";

export const runtime = "nodejs";

const CACHE_MS = 60_000;

type StoredWish = Wish & { id: string; hidden?: boolean };

let cache: { wishes: Wish[]; at: number } | null = null;

export async function GET() {
  if (!storeConfigured()) {
    return NextResponse.json({ wishes: [], configured: false });
  }

  if (cache && Date.now() - cache.at < CACHE_MS) {
    return NextResponse.json({ wishes: cache.wishes, configured: true });
  }

  try {
    const stored = await listEntries<StoredWish>(KEYS.wishes);
    const wishes = stored
      // Deleting the field in the Upstash dashboard removes a wish; setting
      // "hidden": true in its JSON hides it while keeping the text.
      .filter((wish) => wish.name && wish.message && wish.hidden !== true)
      .sort((a, b) => (a.at < b.at ? 1 : -1))
      .map<Wish>(({ name, message, at }) => ({ name, message, at }));

    cache = { wishes, at: Date.now() };
    return NextResponse.json({ wishes, configured: true });
  } catch (error) {
    console.error("Wishes read failed", error);
    return NextResponse.json({ wishes: [], configured: true });
  }
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  if (rateLimited(`wish:${ip}`) || (await rateLimitedInRedis(`wish:${ip}`, 12, 60))) {
    return NextResponse.json(
      { error: "Thanks for the enthusiasm. Please try again in a minute." },
      { status: 429 },
    );
  }

  const parsed = wishSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." },
      { status: 400 },
    );
  }

  if (parsed.data.honeypot) return NextResponse.json({ ok: true });

  const name = sanitize(parsed.data.name);
  const message = sanitize(parsed.data.message);

  if (!name || !message) {
    return NextResponse.json({ error: "Please write a line or two." }, { status: 400 });
  }

  if (containsAbuse(`${name} ${message}`)) {
    return NextResponse.json(
      { error: "Let's keep this one for the family album. Please reword it." },
      { status: 400 },
    );
  }

  if (!storeConfigured()) {
    return NextResponse.json({ error: "not-configured", configured: false }, { status: 503 });
  }

  const wish: Wish = { name, message, at: new Date().toISOString() };

  try {
    await putEntry(KEYS.wishes, wish);
    // The new wish should appear at once, not when the cache happens to expire.
    cache = null;

    return NextResponse.json({ ok: true, wish });
  } catch (error) {
    console.error("Wish write failed", error);
    return NextResponse.json(
      { error: "We could not save that just now. Please try again." },
      { status: 502 },
    );
  }
}
