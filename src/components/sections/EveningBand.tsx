"use client";

import Image from "next/image";

import { Reveal } from "@/components/ui/Reveal";
import { Flourish } from "@/components/ui/ornaments";

/**
 * A cinematic still between the blessing and the venue — atmosphere without
 * the horizontal-scroll gallery, which is parked.
 */
export function EveningBand() {
  return (
    <section className="relative isolate h-[46vh] min-h-[16rem] overflow-hidden md:h-[56vh]">
      <Image
        src="/images/band-hall.jpg"
        alt="Candlelit tables in a grand hall"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-emerald/20 mix-blend-multiply" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-emerald/90 via-emerald/15 to-emerald/95"
        aria-hidden
      />
      <div
        className="absolute inset-0 shadow-[inset_0_0_100px_30px_rgba(10,31,26,0.4)]"
        aria-hidden
      />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <p className="label text-gold-light/85">The Evening</p>
        </Reveal>
        <Reveal delay={0.15}>
          <Flourish className="mt-5 h-5 w-52 sm:w-64" />
        </Reveal>
      </div>
    </section>
  );
}
