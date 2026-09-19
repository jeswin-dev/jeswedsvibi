"use client";

import { motion } from "framer-motion";

import { useGentleMotion } from "@/hooks/useGentleMotion";
import { ease } from "@/lib/motion";

/**
 * A laurel-style sprig, drawn once and mirrored for the other side. It curves
 * along the inside of the ring and stops short of the initials.
 */
const SPRIG_STEM = "M26 96C24 86 26 76 32 68";
const SPRIG_LEAVES = [
  "M25 88C19 86 15 80 17 74C24 76 27 83 25 88Z",
  "M26 79C21 76 18 69 21 64C27 67 29 74 26 79Z",
  "M29 71C25 67 23 60 27 56C32 60 33 67 29 71Z",
  "M27 92C33 91 38 87 39 81C32 80 27 85 27 92Z",
  "M29 83C35 83 40 78 41 72C34 71 29 76 29 83Z",
];

type MonogramProps = {
  initials: [string, string];
  className?: string;
  /** Animate the strokes drawing themselves. */
  animate?: boolean;
  delay?: number;
};

export function Monogram({ initials, className, animate = true, delay = 0 }: MonogramProps) {
  const reduceMotion = useGentleMotion();
  const shouldDraw = animate && !reduceMotion;

  const draw = (index: number) => {
    if (!shouldDraw) return {};
    return {
      initial: { pathLength: 0, opacity: 0 },
      animate: { pathLength: 1, opacity: 1 },
      transition: {
        pathLength: { duration: 1.6, ease, delay: delay + index * 0.08 },
        opacity: { duration: 0.4, delay: delay + index * 0.08 },
      },
    };
  };

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      role="img"
      aria-label={`${initials[0]} and ${initials[1]} monogram`}
    >
      <motion.circle
        cx="60"
        cy="60"
        r="52"
        stroke="var(--color-gold)"
        strokeOpacity="0.45"
        strokeWidth="0.75"
        {...draw(0)}
      />
      <motion.circle
        cx="60"
        cy="60"
        r="47"
        stroke="var(--color-gold)"
        strokeOpacity="0.2"
        strokeWidth="0.5"
        {...draw(1)}
      />

      {([1, -1] as const).map((side) => (
        <g
          key={side}
          transform={side === 1 ? undefined : "translate(120 0) scale(-1 1)"}
          stroke="var(--color-gold)"
          strokeWidth="0.75"
          strokeLinecap="round"
        >
          <motion.path d={SPRIG_STEM} strokeOpacity="0.7" {...draw(2)} />
          {SPRIG_LEAVES.map((leaf, index) => (
            <motion.path
              key={leaf}
              d={leaf}
              strokeOpacity="0.55"
              fill="var(--color-gold)"
              fillOpacity="0.07"
              {...draw(3 + index)}
            />
          ))}
        </g>
      ))}

      {/* Initials overlap slightly so they read as one interlocked mark. */}
      <motion.g
        initial={shouldDraw ? { opacity: 0, scale: 0.94 } : undefined}
        animate={shouldDraw ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 1.1, ease, delay: delay + 0.5 }}
        style={{ transformOrigin: "60px 60px" }}
        fill="var(--color-gold-light)"
        fontFamily="var(--font-display)"
        fontSize="46"
        fontWeight={300}
        textAnchor="middle"
      >
        <text x="48" y="74" fillOpacity="0.95">
          {initials[0]}
        </text>
        <text x="72" y="74" fillOpacity="0.95">
          {initials[1]}
        </text>
      </motion.g>
    </svg>
  );
}
