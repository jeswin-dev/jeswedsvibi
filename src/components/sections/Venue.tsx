"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { GoldRule } from "@/components/ui/GoldRule";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { invitation } from "@/content/invitation";

const { date, venue } = invitation;
const { lat, lng } = venue.coords;

const pin = `${lat},${lng}`;
const embedSrc = `https://www.google.com/maps?q=${pin}&z=16&hl=en&output=embed`;
const googleDirections = `https://www.google.com/maps/dir/?api=1&destination=${pin}&destination_place_id=`;
const appleDirections = `https://maps.apple.com/?daddr=${pin}&q=${encodeURIComponent(venue.name)}`;

export function Venue() {
  const mapRef = useRef<HTMLDivElement>(null);
  // The map is the heaviest thing on the page, so it waits until it is near.
  const nearMap = useInView(mapRef, { once: true, margin: "300px" });

  return (
    <>
      <SectionHeading eyebrow="The Venue" title={venue.name} />

      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[1fr_1.15fr] md:items-center md:gap-14">
        <div className="text-center md:text-left">
          <Reveal>
            <address className="font-display text-xl leading-relaxed font-light text-ivory/90 not-italic sm:text-2xl">
              {venue.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </Reveal>

          <GoldRule className="mx-auto mt-7 w-24 md:mx-0" delay={0.15} />

          <Reveal delay={0.2}>
            <p className="label mt-7 text-gold/75">{date.dayOfWeek}</p>
            <p className="mt-2 font-display text-lg text-ivory/85">
              {date.display} · {date.timeShort}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center md:justify-start">
              <ButtonLink href={googleDirections} target="_blank" rel="noreferrer noopener">
                Google Maps
              </ButtonLink>
              <ButtonLink
                href={appleDirections}
                target="_blank"
                rel="noreferrer noopener"
                tone="outlineLight"
              >
                Apple Maps
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div ref={mapRef} className="relative">
            <div
              className="pointer-events-none absolute -inset-2 border border-gold/15 sm:-inset-3"
              aria-hidden
            />
            <div className="relative aspect-4/3 w-full overflow-hidden border border-gold/40 bg-emerald-mid/30 md:aspect-square">
              {nearMap ? (
                <iframe
                  src={embedSrc}
                  title={`Map showing ${venue.name}, ${venue.area}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full"
                  // Invert plus a 180° hue rotation turns Google's light theme
                  // dark while keeping hues (and the pin) recognisable, so the
                  // map sits in the palette instead of fighting it.
                  style={{
                    border: 0,
                    filter:
                      "invert(0.9) hue-rotate(180deg) saturate(0.6) contrast(0.92) brightness(1.05)",
                  }}
                />
              ) : null}

              {/* Blend mode tints the map emerald without dimming it. Kept
                  light enough that Google's marker stays readable. */}
              <div
                className="pointer-events-none absolute inset-0 bg-emerald/40 mix-blend-color"
                aria-hidden
              />

              {/* The embed centres on the pin, so a halo here lands on it and
                  draws the eye in our own palette. */}
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
    </>
  );
}
