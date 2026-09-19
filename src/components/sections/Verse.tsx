"use client";

import { GoldRule } from "@/components/ui/GoldRule";
import { Ornament } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { invitation } from "@/content/invitation";

const { verse } = invitation;

export function Verse() {
  return (
    <div className="relative">
      <Ornament
        tone="champagne"
        className="absolute top-1/2 left-0 hidden h-56 w-12 -translate-y-1/2 md:block"
      />
      <Ornament
        flip
        tone="champagne"
        className="absolute top-1/2 right-0 hidden h-56 w-12 -translate-y-1/2 md:block"
      />

      <div className="mx-auto flex max-w-2xl flex-col items-center px-2 text-center md:px-16">
        <Reveal>
          <p className="label text-champagne">{verse.eyebrow}</p>
        </Reveal>

        {/* Opening quote set large and offset, as a piece of ornament itself. */}
        <Reveal delay={0.1}>
          <span
            className="mt-6 block font-display text-5xl leading-none text-gold/35 select-none"
            aria-hidden
          >
            &ldquo;
          </span>
        </Reveal>

        <blockquote className="-mt-3 font-display text-[clamp(1.5rem,6.5vw,2.75rem)] leading-[1.25] font-light text-forest italic">
          <SplitText text={verse.text} by="word" delay={0.2} each={0.07} />
        </blockquote>

        <GoldRule ornament className="mt-9 w-28" delay={0.5} />

        <Reveal delay={0.6}>
          <cite className="label mt-6 block text-champagne not-italic">{verse.reference}</cite>
        </Reveal>
      </div>
    </div>
  );
}
