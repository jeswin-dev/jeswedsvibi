"use client";

import { motion } from "framer-motion";

import { useGentleMotion } from "@/hooks/useGentleMotion";
import { useIntro } from "@/components/shell/intro-context";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { FoilText } from "@/components/ui/FoilText";
import { Ornament } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { Crest, Flourish } from "@/components/ui/ornaments";
import { Bokeh, Damask, Velvet } from "@/components/ui/textures";
import { invitation, primaryOccasion, type Edition } from "@/content/invitation";
import { ease } from "@/lib/motion";

const { couple, hero, photo } = invitation;

export function Hero({ edition = "engagement" }: { edition?: Edition }) {
  const { opened } = useIntro();
  const reduceMotion = useGentleMotion();
  const occasion = primaryOccasion(edition);

  return (
    <section className="relative isolate h-screen-safe w-full overflow-hidden bg-emerald">
      <Velvet className="opacity-40 mix-blend-overlay" />
      <Damask className="opacity-[0.08]" scale={130} />
      <Bokeh className="opacity-20 mix-blend-screen [mask-image:linear-gradient(to_bottom,black,transparent_48%)]" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_15%,rgba(27,77,62,0.45),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_180px_50px_rgba(10,31,26,0.7)]"
        aria-hidden
      />

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

      <div className="relative flex h-full flex-col items-center justify-center px-6 pt-safe pb-24 [@media(max-height:520px)]:pb-8">
        <Reveal active={opened} delay={0.08}>
          <Crest className="mb-4 h-8 w-[4.5rem] opacity-90 sm:h-9 sm:w-[5rem] [@media(max-height:520px)]:mb-1 [@media(max-height:520px)]:h-6 [@media(max-height:520px)]:w-12" />
        </Reveal>

        <Reveal active={opened} delay={0.15}>
          <p className="label mb-6 text-center text-gold/75 sm:mb-8 [@media(max-height:520px)]:mb-2">
            {hero.eyebrow}
          </p>
        </Reveal>

        <motion.div
          className="relative aspect-[3/4] h-[38dvh] max-h-[26rem] min-h-[11rem] w-auto sm:h-[40dvh] md:max-h-[28rem] lg:h-[42dvh] [@media(max-height:520px)]:h-[30dvh] [@media(max-height:520px)]:min-h-0"
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

        <h1 className="relative -mt-6 text-center font-display font-light leading-[0.92] text-ivory md:-mt-8">
          <SplitText
            text={couple.one.first}
            active={opened}
            delay={0.5}
            className="block text-[clamp(2.25rem,min(14vw,11vh),5.75rem)] tracking-[0.01em]"
          />
          <motion.span
            className="my-1 block font-display text-[clamp(1rem,min(4vw,3.2vh),1.9rem)] font-light italic md:my-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: opened ? 1 : 0 }}
            transition={{ duration: 1.1, ease, delay: 0.95 }}
          >
            <FoilText>{hero.connector}</FoilText>
          </motion.span>
          <SplitText
            text={couple.two.first}
            active={opened}
            delay={1.1}
            className="block text-[clamp(2.25rem,min(14vw,11vh),5.75rem)] tracking-[0.01em]"
          />
        </h1>

        <Reveal active={opened} delay={1.5}>
          <Flourish className="mt-6 h-5 w-48 sm:w-64 md:mt-8 [@media(max-height:520px)]:mt-2 [@media(max-height:520px)]:h-4" />
        </Reveal>

        <Reveal active={opened} delay={1.7}>
          <div className="mt-6 text-center [@media(max-height:520px)]:mt-3">
            <p className="label text-ivory/80 sm:text-xs">
              {occasion.date.dayOfWeek} · {occasion.date.display}
            </p>
            <p className="mt-2 font-display text-base italic text-champagne sm:text-lg md:text-xl">
              {occasion.venue.area}, {occasion.venue.city}
            </p>
          </div>
        </Reveal>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 pb-safe [@media(max-height:520px)]:hidden"
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
