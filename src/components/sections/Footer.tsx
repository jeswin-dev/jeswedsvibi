"use client";

import { useState } from "react";

import { GoldRule } from "@/components/ui/GoldRule";
import { Monogram } from "@/components/ui/Monogram";
import { Reveal } from "@/components/ui/Reveal";
import { invitation } from "@/content/invitation";

const { contact, couple, date, footer, meta, venue } = invitation;

export function Footer() {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const url = window.location.href;

    // Native share sheet on a phone; clipboard everywhere else.
    if (navigator.share) {
      try {
        await navigator.share({ title: meta.title, text: meta.description, url });
        return;
      } catch {
        // Cancelled, or unavailable — fall through to copying.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col items-center text-center">
      <Reveal>
        <Monogram
          initials={[couple.one.initial, couple.two.initial]}
          className="size-24 sm:size-28"
        />
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mt-6 font-display text-2xl leading-snug font-light text-ivory sm:text-3xl">
          {couple.one.first} &amp; {couple.two.first}
        </p>
        <p className="label mt-4 text-champagne">{date.display}</p>
        <p className="mt-2 text-sm text-ivory/55">
          {venue.name}, {venue.area}
        </p>
      </Reveal>

      <GoldRule ornament className="mt-9 w-32" delay={0.25} />

      <Reveal delay={0.3}>
        <button
          type="button"
          onClick={onShare}
          className="label mt-9 min-h-12 border border-gold/40 px-6 py-3 text-gold-light transition-colors duration-300 hover:bg-gold/10"
        >
          {copied ? "Link copied" : "Share this invitation"}
        </button>
      </Reveal>

      {/* The only place the contact number lives while RSVP is parked. */}
      <Reveal delay={0.35}>
        <p className="mt-10 text-sm text-ivory/60">
          For any details, call {contact.name} on{" "}
          <a
            href={`tel:${contact.phone}`}
            className="border-b border-gold/40 pb-0.5 whitespace-nowrap text-ivory/85 transition-colors hover:border-gold"
          >
            {contact.display}
          </a>
        </p>
      </Reveal>

      <Reveal delay={0.4}>
        <p className="mt-12 font-display text-sm text-ivory/45 italic">{footer.credit}</p>
      </Reveal>
    </div>
  );
}
