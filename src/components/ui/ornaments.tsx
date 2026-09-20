/**
 * Hand-drawn gold ornaments. All SVG on purpose: they stay crisp at any size,
 * cost a fraction of an image, and can be recoloured per section.
 */

type OrnamentProps = {
  className?: string;
  tone?: "gold" | "champagne";
};

const strokeFor = (tone: OrnamentProps["tone"]) =>
  tone === "champagne" ? "var(--color-champagne)" : "var(--color-gold)";

/**
 * A botanical crest: a central lily flanked by curling leaves. Sits above a
 * section's label the way a maker's mark sits above letterpress.
 */
export function Crest({ className, tone = "gold" }: OrnamentProps) {
  const stroke = strokeFor(tone);

  return (
    <svg viewBox="0 0 72 44" className={className} fill="none" aria-hidden>
      <g stroke={stroke} strokeWidth="1" strokeLinecap="round">
        {/* Central lily */}
        <path d="M36 6C40 12 41 19 36 26C31 19 32 12 36 6Z" strokeOpacity="0.8" />
        <path d="M36 12V30" strokeOpacity="0.5" />
        <circle cx="36" cy="4" r="1.6" strokeOpacity="0.85" />

        {/* Curling leaves either side */}
        {([1, -1] as const).map((side) => (
          <g key={side} transform={side === 1 ? undefined : "translate(72 0) scale(-1 1)"}>
            <path d="M38 26C46 25 53 21 56 15" strokeOpacity="0.55" />
            <path
              d="M45 23C49 18 55 15 60 16C56 21 50 24 45 23Z"
              strokeOpacity="0.5"
              fill={stroke}
              fillOpacity="0.08"
            />
            <path d="M56 15C59 13 62 14 62 17C62 19 59 20 58 18" strokeOpacity="0.45" />
          </g>
        ))}

        {/* Base */}
        <path d="M26 31H46" strokeOpacity="0.45" />
        <path d="M31 35H41" strokeOpacity="0.3" />
      </g>
    </svg>
  );
}

const FLOURISH_HALF = (
  <>
    <path d="M132 14H228" strokeOpacity="0.3" />
    <path d="M132 14C146 14 152 7 164 8C172 8.6 172 13 165 13.6C158 14.2 156 9.5 162 8.6" strokeOpacity="0.55" />
    <path
      d="M144 13.2C150 8.4 158 7 163 9C157 13 149 14.2 144 13.2Z"
      strokeOpacity="0.45"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <circle cx="231" cy="14" r="1.4" strokeOpacity="0.5" />
  </>
);

/**
 * An ornamental rule: a centred diamond with scrolling vines running out to a
 * tapered hairline. Replaces the plain hairline wherever a fold needs weight.
 */
export function Flourish({ className, tone = "gold" }: OrnamentProps) {
  const stroke = strokeFor(tone);

  return (
    <svg
      viewBox="0 0 240 28"
      className={className}
      fill="none"
      stroke={stroke}
      strokeWidth="1"
      strokeLinecap="round"
      style={{ color: stroke }}
      aria-hidden
    >
      {/* Centre diamond */}
      <path d="M120 7L124.5 14L120 21L115.5 14Z" strokeOpacity="0.8" />
      <circle cx="120" cy="14" r="1.1" strokeOpacity="0.6" />

      {FLOURISH_HALF}
      <g transform="translate(240 0) scale(-1 1)">{FLOURISH_HALF}</g>
    </svg>
  );
}

/**
 * An ornate corner, drawn once and rotated into all four corners of a framed
 * section. Corners are what make a plain rectangle read as a printed card.
 */
export function CornerFiligree({ className, tone = "gold" }: OrnamentProps) {
  const stroke = strokeFor(tone);

  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <g stroke={stroke} strokeWidth="1" strokeLinecap="round">
        <path d="M2 2H30" strokeOpacity="0.5" />
        <path d="M2 2V30" strokeOpacity="0.5" />
        <path d="M2 9C14 9 22 17 22 29" strokeOpacity="0.35" />
        <path
          d="M8 14C14 14 20 19 21 26C14 25 9 20 8 14Z"
          strokeOpacity="0.4"
          fill={stroke}
          fillOpacity="0.08"
        />
        <path d="M22 29C22 33 25 35 28 34" strokeOpacity="0.3" />
        <circle cx="6" cy="6" r="1.3" strokeOpacity="0.6" />
      </g>
    </svg>
  );
}

const CORNERS = [
  { key: "tl", position: "top-3 left-3 sm:top-6 sm:left-6", rotation: "rotate-0" },
  { key: "tr", position: "top-3 right-3 sm:top-6 sm:right-6", rotation: "rotate-90" },
  { key: "br", position: "bottom-3 right-3 sm:bottom-6 sm:right-6", rotation: "rotate-180" },
  { key: "bl", position: "bottom-3 left-3 sm:bottom-6 sm:left-6", rotation: "-rotate-90" },
] as const;

/** Places the corner ornament in all four corners of its nearest container. */
export function FramedCorners({ tone = "gold" }: OrnamentProps) {
  return (
    <>
      {CORNERS.map(({ key, position, rotation }) => (
        <span
          key={key}
          className={`pointer-events-none absolute block size-9 sm:size-12 ${position} ${rotation}`}
          aria-hidden
        >
          <CornerFiligree tone={tone} className="size-full" />
        </span>
      ))}
    </>
  );
}
