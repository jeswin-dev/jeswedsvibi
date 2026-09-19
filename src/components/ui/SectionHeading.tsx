"use client";

import { GoldRule } from "./GoldRule";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";

type SectionHeadingProps = {
  eyebrow: string;
  title?: string;
  className?: string;
  tone?: "emerald" | "ivory";
};

export function SectionHeading({
  eyebrow,
  title,
  className = "",
  tone = "emerald",
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <Reveal>
        <p className={`label ${tone === "emerald" ? "text-gold/70" : "text-champagne"}`}>
          {eyebrow}
        </p>
      </Reveal>

      {title ? (
        <h2 className="mt-5 font-display text-[clamp(1.9rem,7vw,3.25rem)] leading-tight font-light">
          <SplitText text={title} by="word" delay={0.15} />
        </h2>
      ) : null}

      <GoldRule ornament className="mt-6 w-32 sm:w-40" delay={0.35} />
    </div>
  );
}
