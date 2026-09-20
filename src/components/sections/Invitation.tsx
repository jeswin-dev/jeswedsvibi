"use client";

import { FoilText } from "@/components/ui/FoilText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SplitText } from "@/components/ui/SplitText";
import { Flourish } from "@/components/ui/ornaments";
import { invitation, programme, type Edition } from "@/content/invitation";

const { couple, families, invite } = invitation;

type Family = { relation: string; parents: string; house: string };

function FamilyBlock({ name, side, delay }: { name: string; side: Family; delay: number }) {
  return (
    <div className="flex flex-1 flex-col items-center px-2 text-center">
      <Reveal delay={delay}>
        <h3 className="font-display text-[clamp(1.75rem,8vw,2.5rem)] leading-tight font-light">
          <FoilText tone="bronze">{name}</FoilText>
        </h3>
      </Reveal>

      <Reveal delay={delay + 0.12}>
        <Flourish tone="champagne" className="mt-3 h-4 w-28 md:mt-4" />
      </Reveal>

      <Reveal delay={delay + 0.2}>
        <p className="label mt-4 text-champagne md:mt-5">{side.relation}</p>
        <p className="mt-2 max-w-xs font-display text-lg leading-snug text-forest/85 sm:mt-3 sm:text-xl">
          {side.parents}
        </p>
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-forest/60 sm:mt-3">{side.house}</p>
      </Reveal>
    </div>
  );
}

export function Invitation({ edition = "engagement" }: { edition?: Edition }) {
  const isWedding = edition === "wedding";

  return (
    <>
      <SectionHeading
        eyebrow={isWedding ? invite.weddingEyebrow : invite.eyebrow}
        tone="ivory"
        numeral="I"
      />

      <Reveal delay={0.1}>
        <p className="mx-auto mt-7 max-w-xl text-center font-display text-lg leading-relaxed text-forest/75 italic sm:mt-10 sm:text-xl">
          {isWedding ? invite.weddingLead : invite.lead}
        </p>
      </Reveal>

      <div className="mt-8 flex flex-col items-center gap-6 md:mt-16 md:flex-row md:items-start md:gap-6">
        <FamilyBlock name={couple.one.full} side={families.one} delay={0.15} />

        <Reveal delay={0.3} className="md:self-center md:pt-10">
          <FoilText
            tone="bronze"
            className="block font-display text-4xl leading-none font-light italic md:text-5xl"
          >
            &amp;
          </FoilText>
        </Reveal>

        <FamilyBlock name={couple.two.full} side={families.two} delay={0.3} />
      </div>

      <Reveal delay={0.2}>
        <Flourish tone="champagne" className="mx-auto mt-10 h-5 w-56 md:mt-20 md:w-72" />
      </Reveal>

      {isWedding ? (
        <div className="mx-auto mt-8 flex max-w-lg flex-col gap-5 text-center md:mt-10 md:gap-6">
          {programme.map((occasion) => (
            <div key={occasion.key}>
              <p className="label text-champagne">{occasion.label}</p>
              <p className="mt-2 font-display text-lg leading-snug text-forest">
                {occasion.date.dayOfWeek}, {occasion.date.display}
              </p>
              <p className="mt-1 text-sm text-forest/60">
                {occasion.date.timeShort} · {occasion.venue.name}, {occasion.venue.area}
              </p>
            </div>
          ))}
          <p className="mx-auto mt-2 max-w-md font-display text-base leading-relaxed text-forest/65 italic">
            {invite.closing}
          </p>
        </div>
      ) : (
        <div className="mt-7 text-center md:mt-10">
          <p className="font-display text-[clamp(1.2rem,4.5vw,1.75rem)] leading-snug font-light text-forest">
            <SplitText
              text={`${invitation.date.dayOfWeek}, ${invitation.date.display}`}
              by="word"
            />
          </p>
          <Reveal delay={0.2}>
            <p className="label mt-3 text-champagne md:mt-4">
              {invitation.date.timeShort} · {invitation.venue.name}, {invitation.venue.area}
            </p>
            <p className="mx-auto mt-5 max-w-md font-display text-base leading-relaxed text-forest/65 italic md:mt-8">
              {invite.closing}
            </p>
          </Reveal>
        </div>
      )}
    </>
  );
}
