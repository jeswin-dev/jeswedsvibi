"use client";

import { GoldRule } from "@/components/ui/GoldRule";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SplitText } from "@/components/ui/SplitText";
import { invitation } from "@/content/invitation";

const { couple, date, families, invite, venue } = invitation;

// Structural, because `as const` in the content file makes each side's literal
// types incompatible with the other's.
type Family = { relation: string; parents: string; house: string };

function FamilyBlock({ name, side, delay }: { name: string; side: Family; delay: number }) {
  return (
    <div className="flex flex-1 flex-col items-center text-center">
      <Reveal delay={delay}>
        <h3 className="font-display text-[clamp(1.75rem,8vw,2.5rem)] leading-tight font-light text-forest">
          {name}
        </h3>
      </Reveal>

      <GoldRule className="mt-4 w-16" delay={delay + 0.15} />

      <Reveal delay={delay + 0.2}>
        <p className="label mt-5 text-champagne">{side.relation}</p>
        <p className="mt-3 max-w-xs font-display text-lg leading-snug text-forest/85 sm:text-xl">
          {side.parents}
        </p>
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-forest/60">{side.house}</p>
      </Reveal>
    </div>
  );
}

export function Invitation() {
  return (
    <>
      <SectionHeading eyebrow={invite.eyebrow} tone="ivory" />

      <Reveal delay={0.1}>
        <p className="mx-auto mt-10 max-w-xl text-center text-[0.9375rem] leading-relaxed text-forest/75 sm:text-base">
          {invite.lead}
        </p>
      </Reveal>

      <div className="mt-12 flex flex-col items-center gap-9 md:mt-16 md:flex-row md:items-start md:gap-6">
        <FamilyBlock name={couple.one.full} side={families.one} delay={0.15} />

        <Reveal delay={0.3} className="md:self-center md:pt-12">
          <span className="block font-display text-3xl leading-none font-light text-gold/70 italic md:text-4xl">
            &amp;
          </span>
        </Reveal>

        <FamilyBlock name={couple.two.full} side={families.two} delay={0.3} />
      </div>

      <GoldRule ornament className="mx-auto mt-14 w-40 md:mt-20 md:w-56" delay={0.2} />

      <div className="mt-10 text-center">
        <p className="font-display text-[clamp(1.1rem,4.5vw,1.6rem)] leading-snug font-light text-forest">
          <SplitText text={`${date.dayOfWeek}, ${date.display}`} by="word" />
        </p>
        <Reveal delay={0.2}>
          <p className="label mt-4 text-champagne">
            {date.timeShort} · {venue.name}, {venue.area}
          </p>
          <p className="mx-auto mt-8 max-w-md text-[0.875rem] leading-relaxed text-forest/65">
            {invite.closing}
          </p>
        </Reveal>
      </div>
    </>
  );
}
