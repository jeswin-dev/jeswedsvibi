import { NextResponse } from "next/server";

import { clientIp, rateLimited } from "@/lib/guard";
import { rsvpSchema } from "@/lib/schemas";
import { KEYS, putEntry, rateLimitedInRedis, storeConfigured } from "@/lib/store";

export const runtime = "nodejs";

/**
 * The RSVP fold is parked, so nothing calls this yet. It stays wired to the same
 * store as the wishes wall, ready for the day it comes back.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);

  if (rateLimited(`rsvp:${ip}`) || (await rateLimitedInRedis(`rsvp:${ip}`, 12, 60))) {
    return NextResponse.json(
      { error: "That was a lot of replies at once. Please try again in a minute." },
      { status: 429 },
    );
  }

  const parsed = rsvpSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." },
      { status: 400 },
    );
  }

  const { name, phone, attending, guests, honeypot } = parsed.data;
  // Silently accept bot submissions rather than telling them they were caught.
  if (honeypot) return NextResponse.json({ ok: true });

  if (!storeConfigured()) {
    return NextResponse.json({ error: "not-configured", configured: false }, { status: 503 });
  }

  try {
    await putEntry(KEYS.rsvps, {
      name,
      phone,
      attending: attending === "yes" ? "Yes" : "No",
      guests: attending === "yes" ? guests : 0,
      at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("RSVP write failed", error);
    return NextResponse.json(
      { error: "We could not save that just now. Please try again, or call us." },
      { status: 502 },
    );
  }
}
