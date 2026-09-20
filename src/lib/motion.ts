import type { Transition, Variants } from "framer-motion";

export const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Variants deliberately carry no transition of their own: a transition defined
 * inside a variant overrides the one passed on the component, which silently
 * swallows per-instance delays and breaks the choreography.
 */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0 },
};

export const revealTransition = (delay = 0): Transition => ({ duration: 0.9, ease, delay });

export const fade: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1 },
};

export const fadeTransition = (delay = 0): Transition => ({ duration: 1.2, ease, delay });

/** Parent of split text: children inherit the stagger. */
export const stagger = (each = 0.04, delay = 0): Variants => ({
  hidden: {},
  shown: { transition: { staggerChildren: each, delayChildren: delay } },
});

/**
 * Each letter or word of a heading, masked by an overflow-hidden wrapper. The
 * distance clears the mask's descender padding as well as the line box, so a
 * letter is genuinely out of sight before it rises.
 */
export const riseChild: Variants = {
  hidden: { y: "135%" },
  shown: { y: "0%", transition: { duration: 1, ease } },
};

/** Gold hairlines draw themselves from the centre outwards. */
export const drawRule: Variants = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1 },
};

export const drawRuleTransition = (delay = 0): Transition => ({ duration: 1.4, ease, delay });

export const viewportOnce = { once: true, amount: 0.25 } as const;

/** Tall ornaments rarely reach 25% of the viewport, so they get a lower bar. */
export const viewportOnceEdge = { once: true, amount: 0.1 } as const;
