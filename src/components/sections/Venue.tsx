"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { GoldRule } from "@/components/ui/GoldRule";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { invitation, programme, type Occasion } from "@/content/invitation";
import { googleCalendarUrl } from "@/lib/calendar";

function directions(occasion: Occasion) {
  const { lat, lng } = occasion.venue.coords;
  const pin = `${lat},${lng}`;
  return {
    embedSrc: `https://www.google.com/maps?q=${pin}&z=16&hl=en&output=embed`,
    google: `https://www.google.com/maps/dir/?api=1&destination=${pin}`,
    apple: `https://maps.apple.com/?daddr=${pin}&q=${encodeURIComponent(occasion.venue.name)}`,
  };
}

function VenueCard({ occasion, delay = 0 }: { occasion: Occasion; delay?: number }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const nearMap = useInView(mapRef, { once: true, margin: "300px" });
  const { embedSrc, google, apple } = directions(occasion);
  const { date, venue } = occasion;

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1.15fr] md:items-center md:gap-14">
      <div className="text-center md:text-left">
        <Reveal delay={delay}>
          <p className="label text-gold/75">{occasion.label}</p>
          <h3 className="mt-3 font-display text-3xl leading-tight font-light text-ivory sm:text-4xl">
            {venue.name}
          </h3>
        </Reveal>

        <Reveal delay={delay + 0.08}>
          <address className="mt-5 font-display text-xl leading-relaxed font-light text-ivory/90 not-italic sm:text-2xl">
            {venue.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </Reveal>

        <GoldRule className="mx-auto mt-7 w-24 md:mx-0" delay={delay + 0.15} />

        <Reveal delay={delay + 0.2}>
          <p className="label mt-7 text-gold/75">{date.dayOfWeek}</p>
          <p className="mt-2 font-display text-lg text-ivory/85">
            {date.display} · {date.timeShort}
          </p>
        </Reveal>

        <Reveal delay={delay + 0.3}>
          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center md:justify-start">
            <ButtonLink href={google} target="_blank" rel="noreferrer noopener">
              Google Maps
            </ButtonLink>
            <ButtonLink href={apple} target="_blank" rel="noreferrer noopener" tone="outlineLight">
              Apple Maps
            </ButtonLink>
            <ButtonLink
              href={googleCalendarUrl(occasion)}
              target="_blank"
              rel="noreferrer noopener"
              tone="outlineLight"
            >
              Calendar
            </ButtonLink>
          </div>
        </Reveal>
      </div>

      <Reveal delay={delay + 0.15}>
        <div ref={mapRef} className="relative">
          <div
            className="pointer-events-none absolute -inset-3 border border-gold/20 sm:-inset-4"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -inset-1.5 border border-gold/40"
            aria-hidden
          />
          <div className="relative aspect-4/3 w-full overflow-hidden border border-gold/50 bg-emerald-mid/30 md:aspect-square">
            {nearMap ? (
              <iframe
                src={embedSrc}
                title={`Map showing ${venue.name}, ${venue.area}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
                style={{
                  border: 0,
                  filter:
                    "invert(0.9) hue-rotate(180deg) saturate(0.6) contrast(0.92) brightness(1.05)",
                }}
              />
            ) : null}

            <div
              className="pointer-events-none absolute inset-0 bg-emerald/40 mix-blend-color"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute top-1/2 left-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/50 bg-[radial-gradient(circle,rgba(201,162,39,0.18),transparent_70%)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_18px_rgba(10,31,26,0.45)]"
              aria-hidden
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export function Venue() {
  return (
    <>
      <SectionHeading eyebrow="The Venue" title={invitation.venue.name} numeral="IV" />
      <div className="mt-12 md:mt-16">
        <VenueCard occasion={invitation.occasions.engagement} />
      </div>
    </>
  );
}

export function Celebrations() {
  return (
    <>
      <SectionHeading eyebrow="The Celebrations" numeral="IV" />
      <div className="mt-12 flex flex-col gap-20 md:mt-16 md:gap-28">
        {programme.map((occasion) => (
          <VenueCard key={occasion.key} occasion={occasion} />
        ))}
      </div>
    </>
  );
}
