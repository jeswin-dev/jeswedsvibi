"use client";

import { FoilText } from "./FoilText";
import { Reveal } from "./Reveal";
import { Crest, Flourish } from "./ornaments";

type SectionHeadingProps = {
  eyebrow: string;
  title?: string;
  className?: string;
  tone?: "emerald" | "ivory";
  /** A roman numeral gives the page the structure of a printed programme. */
  numeral?: string;
  crest?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  className = "",
  tone = "emerald",
  numeral,
  crest = true,
}: SectionHeadingProps) {
  const onDark = tone === "emerald";

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {crest ? (
        <Reveal>
          <Crest
            tone="gold"
            className="mb-3.5 h-8 w-[4.5rem] opacity-90 sm:mb-5 sm:h-10 sm:w-[5.5rem]"
          />
        </Reveal>
      ) : null}

      {numeral ? (
        <Reveal delay={0.05}>
          <span
            className={`label mb-3 flex items-center gap-3 text-[0.5625rem] sm:mb-4 ${
              onDark ? "text-gold/55" : "text-champagne/70"
            }`}
          >
            <span className={`h-px w-5 ${onDark ? "bg-gold/35" : "bg-champagne/40"}`} />
            {numeral}
            <span className={`h-px w-5 ${onDark ? "bg-gold/35" : "bg-champagne/40"}`} />
          </span>
        </Reveal>
      ) : null}

      <Reveal delay={0.1}>
        <p className={`label ${onDark ? "text-gold/70" : "text-champagne"}`}>{eyebrow}</p>
      </Reveal>

      {title ? (
        <Reveal delay={0.15}>
          <h2 className="mt-3.5 font-display text-[clamp(1.9rem,7vw,3.25rem)] leading-tight font-light sm:mt-5">
            <FoilText tone={onDark ? "gold" : "bronze"}>{title}</FoilText>
          </h2>
        </Reveal>
      ) : null}

      <Reveal delay={0.3}>
        <Flourish
          tone={onDark ? "gold" : "champagne"}
          className="mt-5 h-5 w-56 sm:mt-6 sm:w-72 md:w-80"
        />
      </Reveal>
    </div>
  );
}
