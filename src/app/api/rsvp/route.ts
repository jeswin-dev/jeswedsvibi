import { NextResponse } from "next/server";

import { clientIp, rateLimited } from "@/lib/guard";
import { rsvpSchema } from "@/lib/schemas";
import { TABS, appendRow, credentials } from "@/lib/sheets";

// Signing the service-account JWT needs node:crypto.
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (rateLimited(`rsvp:${clientIp(request)}`)) {
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

  if (!credentials()) {
    return NextResponse.json(
      { error: "not-configured", configured: false },
      { status: 503 },
    );
  }

  try {
    await appendRow(TABS.rsvp, [
      new Date().toISOString(),
      name,
      phone,
      attending === "yes" ? "Yes" : "No",
      attending === "yes" ? guests : 0,
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("RSVP write failed", error);
    return NextResponse.json(
      { error: "We could not save that just now. Please try again, or call us." },
      { status: 502 },
    );
  }
}
