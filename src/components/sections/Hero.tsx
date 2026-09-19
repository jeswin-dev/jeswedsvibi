"use client";

import { motion, useReducedMotion } from "framer-motion";

import { useIntro } from "@/components/shell/intro-context";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { GoldRule } from "@/components/ui/GoldRule";
import { Ornament } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { invitation } from "@/content/invitation";
import { ease } from "@/lib/motion";

const { couple, date, hero, photo, venue } = invitation;

export function Hero() {
  // The hero is behind the envelope, so it waits for the seal to break
  // rather than animating unseen.
  const { opened } = useIntro();
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate h-screen-safe w-full overflow-hidden bg-emerald">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_15%,rgba(27,77,62,0.65),transparent_70%)]"
        aria-hidden
      />

      {/* Fills the wide emerald margins on desktop; unnecessary on a phone. */}
      <Ornament
        active={opened}
        delay={1.9}
        className="absolute top-1/2 left-[8%] hidden h-[52dvh] w-16 -translate-y-1/2 lg:block xl:left-[12%]"
      />
      <Ornament
        flip
        active={opened}
        delay={1.9}
        className="absolute top-1/2 right-[8%] hidden h-[52dvh] w-16 -translate-y-1/2 lg:block xl:right-[12%]"
      />

      {/* Bottom padding reserves room for the scroll cue so the two can never
          collide on a short viewport. */}
      <div className="relative flex h-full flex-col items-center justify-center px-6 pt-safe pb-24">
        <Reveal active={opened} delay={0.15}>
          <p className="label mb-6 text-center text-gold/70 sm:mb-8">{hero.eyebrow}</p>
        </Reveal>

        {/* Height-driven so it never overflows a short or landscape screen. */}
        <motion.div
          className="relative aspect-[3/4] h-[38dvh] max-h-[26rem] min-h-[11rem] w-auto sm:h-[40dvh] md:max-h-[28rem] lg:h-[42dvh]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={opened ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
          transition={{ duration: 1.6, ease, delay: 0.1 }}
        >
          <ArchFrame
            src={photo.src}
            alt={photo.alt}
            priority
            kenBurns
            className="h-full w-full"
            sizes="(max-width: 768px) 60vw, 22vw"
          />
        </motion.div>

        {/* Names overlap the base of the arch, where it fades to emerald. */}
        <h1 className="relative -mt-6 text-center font-display font-light leading-[0.92] text-ivory md:-mt-8">
          <SplitText
            text={couple.one.first}
            active={opened}
            delay={0.5}
            className="block text-[clamp(2.75rem,14vw,5.75rem)] tracking-[0.01em]"
          />
          <motion.span
            className="my-1 block font-display text-[clamp(1.1rem,4vw,1.9rem)] font-light italic text-gold-light/80 md:my-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: opened ? 1 : 0 }}
            transition={{ duration: 1.1, ease, delay: 0.95 }}
          >
            {hero.connector}
          </motion.span>
          <SplitText
            text={couple.two.first}
            active={opened}
            delay={1.1}
            className="block text-[clamp(2.75rem,14vw,5.75rem)] tracking-[0.01em]"
          />
        </h1>

        <GoldRule ornament active={opened} delay={1.5} className="mt-7 w-40 sm:w-52 md:mt-9" />

        <Reveal active={opened} delay={1.7}>
          <div className="mt-6 text-center">
            <p className="label text-ivory/75 sm:text-xs">
              {date.dayOfWeek} · {date.display}
            </p>
            <p className="mt-2 font-display text-base italic text-champagne sm:text-lg md:text-xl">
              {venue.area}, {venue.city}
            </p>
          </div>
        </Reveal>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 pb-safe"
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ duration: 1, ease, delay: 2.2 }}
        aria-hidden
      >
        <span className="label pb-1 text-[0.5625rem] text-ivory/45">{hero.scrollCue}</span>
        <span className="relative block h-12 w-px overflow-hidden bg-gold/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-gold/70"
            animate={reduceMotion ? undefined : { y: ["-100%", "200%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
