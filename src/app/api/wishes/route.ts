import { NextResponse } from "next/server";

import { clientIp, containsAbuse, rateLimited, sanitize } from "@/lib/guard";
import type { Wish } from "@/lib/schemas";
import { wishSchema } from "@/lib/schemas";
import { TABS, appendRow, credentials, readRows } from "@/lib/sheets";

export const runtime = "nodejs";

/** Columns: Timestamp | Name | Message | Hidden */
const RANGE = `${TABS.wishes}!A2:D`;
const CACHE_MS = 60_000;

let cache: { wishes: Wish[]; at: number } | null = null;

export async function GET() {
  if (!credentials()) {
    return NextResponse.json({ wishes: [], configured: false });
  }

  if (cache && Date.now() - cache.at < CACHE_MS) {
    return NextResponse.json({ wishes: cache.wishes, configured: true });
  }

  try {
    const rows = await readRows(RANGE);
    const wishes = rows
      // Setting Hidden to TRUE in the sheet pulls a wish off the site.
      .filter((row) => row[1] && row[2] && String(row[3] ?? "").toUpperCase() !== "TRUE")
      .map<Wish>((row) => ({ at: row[0] ?? "", name: row[1], message: row[2] }))
      .reverse();

    cache = { wishes, at: Date.now() };
    return NextResponse.json({ wishes, configured: true });
  } catch (error) {
    console.error("Wishes read failed", error);
    return NextResponse.json({ wishes: [], configured: true });
  }
}

export async function POST(request: Request) {
  if (rateLimited(`wish:${clientIp(request)}`)) {
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

  const { honeypot } = parsed.data;
  if (honeypot) return NextResponse.json({ ok: true });

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

  if (!credentials()) {
    return NextResponse.json({ error: "not-configured", configured: false }, { status: 503 });
  }

  try {
    await appendRow(TABS.wishes, [new Date().toISOString(), name, message, "FALSE"]);
    // The new wish should show up immediately, not after the cache expires.
    cache = null;

    return NextResponse.json({ ok: true, wish: { name, message, at: new Date().toISOString() } });
  } catch (error) {
    console.error("Wish write failed", error);
    return NextResponse.json(
      { error: "We could not save that just now. Please try again." },
      { status: 502 },
    );
  }
}
