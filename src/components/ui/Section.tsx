import type { ReactNode } from "react";

import { FramedCorners } from "./ornaments";
import { Bokeh, Damask, Marble, Paper, Velvet } from "./textures";

type Tone = "emerald" | "ivory";

type SectionProps = {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  className?: string;
  /** Inset gold hairline frame, for the more formal folds. */
  framed?: boolean;
  /** Tightens the vertical rhythm for short folds. */
  compact?: boolean;
};

const surface: Record<Tone, string> = {
  emerald: "bg-emerald text-ivory",
  ivory: "bg-ivory text-forest",
};

export function Section({
  children,
  tone = "emerald",
  id,
  className = "",
  framed = false,
  compact = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative isolate overflow-hidden ${surface[tone]} ${className}`}
    >
      {tone === "emerald" ? (
        <>
          <Velvet className="opacity-30 mix-blend-overlay" />
          <Damask className="opacity-[0.07]" scale={118} />
          <Bokeh className="opacity-20 mix-blend-screen [mask-image:linear-gradient(to_bottom,black,transparent_42%)]" />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_55%_at_50%_0%,rgba(27,77,62,0.45),transparent_70%)]"
            aria-hidden
          />
          {/* Vignette: keeps the corners from feeling like a flat rectangle. */}
          <div
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_160px_48px_rgba(10,31,26,0.62)]"
            aria-hidden
          />
        </>
      ) : (
        <>
          <Marble />
          <Damask className="opacity-[0.04]" scale={118} tone="forest" />
          <Paper />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_50%_at_50%_10%,rgba(255,255,255,0.55),transparent_70%)]"
            aria-hidden
          />
        </>
      )}

      {framed ? (
        <>
          {/* A double rule and ornamented corners: the difference between a web
              section and a printed card. */}
          <div
            className={`pointer-events-none absolute inset-3 border sm:inset-6 ${
              tone === "emerald" ? "border-gold/25" : "border-champagne/30"
            }`}
            aria-hidden
          />
          <div
            className={`pointer-events-none absolute inset-[1.125rem] border sm:inset-[1.875rem] ${
              tone === "emerald" ? "border-gold/10" : "border-champagne/15"
            }`}
            aria-hidden
          />
          <FramedCorners tone={tone === "emerald" ? "gold" : "champagne"} />
        </>
      ) : null}

      <div
        className={`relative mx-auto w-full max-w-5xl px-5 sm:px-10 ${
          compact ? "py-12 md:py-24" : "py-14 sm:py-20 md:py-36"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

type ArchDividerProps = {
  from: Tone;
  to: Tone;
};

const fillFor: Record<Tone, string> = {
  emerald: "#0e2a23",
  ivory: "#f7f3ea",
};

/**
 * Sections meet through the same arch silhouette as the hero frame, so the page
 * reads as one composition instead of stacked rectangles.
 */
export function ArchDivider({ from, to }: ArchDividerProps) {
  const path = "M0 100C22 100 26 0 50 0C74 0 78 100 100 100Z";

  return (
    <div className={`relative h-16 w-full md:h-24 ${surface[from]}`} aria-hidden>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path d={path} fill={fillFor[to]} />
        <path
          d={path}
          fill="none"
          stroke="#c9a227"
          strokeOpacity="0.45"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* A foil diamond at the arch's crown, so the join feels jewelled. */}
      <span
        className="absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-gold/70"
        style={{
          backgroundImage: "url('/images/gold-foil.jpg')",
          backgroundSize: "cover",
        }}
      />
    </div>
  );
}
