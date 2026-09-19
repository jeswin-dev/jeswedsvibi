"use client";

import { motion, useReducedMotion } from "framer-motion";

import { ease, viewportOnce } from "@/lib/motion";

const STEM = "M20 6C11 92 29 168 20 248C11 328 26 366 20 394";

/** Leaves alternate down the stem and taper towards the tip. */
const LEAVES = Array.from({ length: 9 }, (_, index) => {
  const y = 40 + index * 40;
  const side = index % 2 === 0 ? -1 : 1;
  const length = 17 - index * 0.9;
  return { y, side, length, key: `leaf-${index}` };
});

type OrnamentProps = {
  className?: string;
  /** Mirror the sprig so a pair can flank a composition. */
  flip?: boolean;
  active?: boolean;
  delay?: number;
  /** Champagne carries better on the ivory sections than gold does. */
  tone?: "gold" | "champagne";
};

export function Ornament({
  className,
  flip = false,
  active,
  delay = 0,
  tone = "gold",
}: OrnamentProps) {
  const stroke = tone === "gold" ? "var(--color-gold)" : "var(--color-champagne)";
  const reduceMotion = useReducedMotion();
  const trigger =
    active === undefined
      ? ({ whileInView: "shown", viewport: viewportOnce } as const)
      : ({ animate: active ? "shown" : "hidden" } as const);

  // Kept free of transitions so the staggered delays below actually apply.
  const variants = {
    hidden: { pathLength: reduceMotion ? 1 : 0, opacity: 0 },
    shown: { pathLength: 1, opacity: 1 },
  };

  const timing = (at: number) => ({
    pathLength: { duration: 2.2, ease, delay: at },
    opacity: { duration: 1, ease, delay: at },
  });

  return (
    <svg
      viewBox="0 0 40 400"
      /* Uniform scaling keeps the leaves from squashing into specks. */
      preserveAspectRatio="xMidYMid meet"
      className={className}
      fill="none"
      stroke={stroke}
      strokeWidth="1"
      strokeLinecap="round"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden
    >
      <motion.path
        d={STEM}
        strokeOpacity="0.55"
        variants={variants}
        initial="hidden"
        transition={timing(delay)}
        {...trigger}
      />
      {LEAVES.map((leaf, index) => (
        <motion.ellipse
          key={leaf.key}
          cx={20 + leaf.side * (leaf.length / 2 + 2)}
          cy={leaf.y}
          rx={leaf.length / 2}
          ry="4"
          strokeOpacity="0.5"
          fill={stroke}
          fillOpacity="0.08"
          transform={`rotate(${leaf.side * -32} ${20 + leaf.side * (leaf.length / 2 + 2)} ${leaf.y})`}
          variants={variants}
          initial="hidden"
          transition={timing(delay + 0.25 + index * 0.07)}
          {...trigger}
        />
      ))}
    </svg>
  );
}
