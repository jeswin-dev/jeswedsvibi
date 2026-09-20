"use client";

import { FoilText } from "@/components/ui/FoilText";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { Crest, Flourish } from "@/components/ui/ornaments";
import { invitation } from "@/content/invitation";

const { verse } = invitation;

export function Verse() {
  return (
    <div className="relative mx-auto max-w-2xl px-2 text-center md:px-8">
      <Reveal>
        <Crest tone="gold" className="mx-auto mb-5 h-8 w-[4.5rem] opacity-90" />
      </Reveal>

      <Reveal delay={0.05}>
        <span className="label mb-4 flex items-center gap-3 text-[0.5625rem] text-champagne/70">
          <span className="h-px w-5 bg-champagne/40" />
          III
          <span className="h-px w-5 bg-champagne/40" />
        </span>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="label text-champagne">{verse.eyebrow}</p>
      </Reveal>

      <Reveal delay={0.1}>
        <FoilText
          tone="bronze"
          className="mt-6 block font-display text-6xl leading-none select-none"
        >
          &ldquo;
        </FoilText>
      </Reveal>

      <blockquote className="-mt-5 font-display text-[clamp(1.5rem,6.5vw,2.75rem)] leading-[1.25] font-light text-forest italic">
        <SplitText text={verse.text} by="word" delay={0.2} each={0.07} />
      </blockquote>

      <Reveal delay={0.45}>
        <Flourish tone="champagne" className="mx-auto mt-8 h-5 w-48 sm:w-64" />
      </Reveal>

      <Reveal delay={0.6}>
        <cite className="label mt-6 block text-champagne not-italic">{verse.reference}</cite>
      </Reveal>
    </div>
  );
}
