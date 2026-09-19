"use client";

import { motion } from "framer-motion";

import { drawRule, drawRuleTransition, viewportOnce } from "@/lib/motion";

type GoldRuleProps = {
  className?: string;
  /** A small diamond at the centre, for section breaks rather than inline rules. */
  ornament?: boolean;
  /** Drive the animation from state instead of scroll position. */
  active?: boolean;
  delay?: number;
};

export function GoldRule({ className = "", ornament = false, active, delay = 0 }: GoldRuleProps) {
  const trigger =
    active === undefined
      ? ({ whileInView: "shown", viewport: viewportOnce } as const)
      : ({ animate: active ? "shown" : "hidden" } as const);

  return (
    <motion.div
      className={`flex items-center justify-center ${ornament ? "gap-3" : ""} ${className}`}
      variants={drawRule}
      initial="hidden"
      transition={drawRuleTransition(delay)}
      {...trigger}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/50 to-gold/70" />
      {ornament ? (
        <span className="size-1.5 rotate-45 border border-gold/70 bg-transparent" aria-hidden />
      ) : null}
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/50 to-gold/70" />
    </motion.div>
  );
}
