"use client";

import { AnimatePresence, motion } from "framer-motion";

import { useGentleMotion } from "@/hooks/useGentleMotion";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { primaryOccasion, type Edition } from "@/content/invitation";
import { useCountdown } from "@/hooks/useCountdown";
import { googleCalendarUrl, icsDataUrl, icsFileName } from "@/lib/calendar";
import { ease } from "@/lib/motion";

function Digit({ value, label, delay }: { value: number; label: string; delay: number }) {
  const reduceMotion = useGentleMotion();
  const display = String(value).padStart(2, "0");

  return (
    <Reveal delay={delay} className="flex flex-col items-center">
      <span className="relative flex h-20 w-[4.25rem] items-center justify-center border border-gold/35 bg-[linear-gradient(180deg,rgba(227,201,120,0.08),rgba(14,42,35,0.2))] sm:h-24 sm:w-20 md:h-28 md:w-24">
        <span className="absolute -top-px -left-px size-2.5 border-t border-l border-gold/80" />
        <span className="absolute -top-px -right-px size-2.5 border-t border-r border-gold/80" />
        <span className="absolute -bottom-px -left-px size-2.5 border-b border-l border-gold/80" />
        <span className="absolute -right-px -bottom-px size-2.5 border-b border-r border-gold/80" />
        <span
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-soft-light"
          style={{ backgroundImage: "url('/images/gold-foil.jpg')", backgroundSize: "cover" }}
          aria-hidden
        />

        {/* Reduced motion shortens the flip rather than changing the markup,
            which would mismatch on hydration. */}
        <span className="relative block h-[1.15em] overflow-hidden font-display text-[clamp(2rem,9vw,3.25rem)] leading-none font-light text-ivory tabular-nums">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={display}
              className="block"
              initial={reduceMotion ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
              animate={reduceMotion ? { opacity: 1 } : { y: "0%", opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.45, ease }}
            >
              {display}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
      <span className="label mt-3 text-[0.5625rem] text-champagne">{label}</span>
    </Reveal>
  );
}

export function Countdown({ edition = "engagement" }: { edition?: Edition }) {
  const occasion = primaryOccasion(edition);
  const { days, hours, minutes, seconds, isPast, isToday, ready } = useCountdown(
    occasion.date.iso,
  );

  return (
    <>
      <SectionHeading
        eyebrow="The Countdown"
        title={isPast ? "With gratitude" : "Counting down"}
        numeral="II"
      />

      {isPast ? (
        <Reveal delay={0.2}>
          <p className="mx-auto mt-10 max-w-md text-center font-display text-xl leading-snug font-light text-ivory/80 italic">
            Thank you for celebrating with us.
          </p>
        </Reveal>
      ) : (
        <>
          {/* Reserve the row's height before the first tick so nothing jumps. */}
          <div
            className="mt-12 flex items-start justify-center gap-2.5 sm:gap-4 md:mt-16"
            style={{ visibility: ready ? "visible" : "hidden" }}
          >
            <Digit value={days} label="Days" delay={0} />
            <Digit value={hours} label="Hours" delay={0.08} />
            <Digit value={minutes} label="Minutes" delay={0.16} />
            <Digit value={seconds} label="Seconds" delay={0.24} />
          </div>

          {isToday ? (
            <Reveal delay={0.2}>
              <p className="mt-10 text-center font-display text-xl font-light text-gold-light italic">
                Today is the day.
              </p>
            </Reveal>
          ) : null}
        </>
      )}

      <Reveal delay={0.3}>
        <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-16">
          <ButtonLink href={googleCalendarUrl(occasion)} target="_blank" rel="noreferrer noopener">
            Add to Google Calendar
          </ButtonLink>
          <ButtonLink
            href={icsDataUrl(occasion)}
            download={icsFileName(edition)}
            tone="outlineLight"
          >
            Download invite
          </ButtonLink>
        </div>
      </Reveal>
    </>
  );
}
