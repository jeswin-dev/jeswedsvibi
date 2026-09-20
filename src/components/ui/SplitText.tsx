"use client";

import { motion } from "framer-motion";

import { useGentleMotion } from "@/hooks/useGentleMotion";
import { fade, riseChild, stagger, viewportOnce } from "@/lib/motion";

/**
 * The mask clips at the line box, which cuts the tails off descenders — the J in
 * a display serif most visibly. Padding gives those glyphs room; the matching
 * negative margin keeps the padding from shifting the layout.
 */
const MASK = "inline-block overflow-hidden align-bottom pb-[0.2em] -mb-[0.2em]";

type SplitTextProps = {
  text: string;
  /** Characters read as more deliberate; words are better for long lines. */
  by?: "char" | "word";
  className?: string;
  delay?: number;
  each?: number;
  /** Drive the animation from state instead of scroll position. */
  active?: boolean;
};

export function SplitText({
  text,
  by = "char",
  className,
  delay = 0,
  each = by === "char" ? 0.035 : 0.06,
  active,
}: SplitTextProps) {
  const reduceMotion = useGentleMotion();
  const trigger =
    active === undefined
      ? ({ whileInView: "shown", viewport: viewportOnce } as const)
      : ({ animate: active ? "shown" : "hidden" } as const);

  const words = text.split(" ");

  /**
   * Reduced motion changes only the variants, never the markup. Branching on
   * the markup would mismatch between the server (which cannot know the
   * preference) and the client, and React would throw out the tree.
   */
  return (
    <motion.span
      className={className}
      variants={reduceMotion ? fade : stagger(each, delay)}
      initial="hidden"
      transition={reduceMotion ? { duration: 0.8, delay } : undefined}
      {...trigger}
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap" aria-hidden>
          {by === "char" ? (
            [...word].map((char, charIndex) => (
              <span key={charIndex} className={MASK}>
                <motion.span
                  className="inline-block"
                  variants={reduceMotion ? undefined : riseChild}
                >
                  {char}
                </motion.span>
              </span>
            ))
          ) : (
            <span className={MASK}>
              <motion.span className="inline-block" variants={reduceMotion ? undefined : riseChild}>
                {word}
              </motion.span>
            </span>
          )}
          {wordIndex < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      ))}
    </motion.span>
  );
}
