import type { ReactNode } from "react";

import { Damask, Paper } from "./textures";

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
          <Damask className="opacity-[0.05]" scale={118} />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_55%_at_50%_0%,rgba(27,77,62,0.55),transparent_70%)]"
            aria-hidden
          />
          {/* Vignette: keeps the corners from feeling like a flat rectangle. */}
          <div
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_140px_40px_rgba(10,31,26,0.55)]"
            aria-hidden
          />
        </>
      ) : (
        <>
          <Damask className="opacity-[0.035]" scale={118} tone="forest" />
          <Paper />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_50%_at_50%_10%,rgba(255,255,255,0.7),transparent_70%)]"
            aria-hidden
          />
        </>
      )}

      {framed ? (
        <div
          className={`pointer-events-none absolute inset-4 border sm:inset-6 md:inset-8 ${
            tone === "emerald" ? "border-gold/20" : "border-champagne/25"
          }`}
          aria-hidden
        />
      ) : null}

      <div
        className={`relative mx-auto w-full max-w-5xl px-6 sm:px-10 ${
          compact ? "py-16 md:py-24" : "py-24 md:py-36"
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
    <div className={`relative h-14 w-full md:h-20 ${surface[from]}`} aria-hidden>
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
          strokeOpacity="0.3"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
