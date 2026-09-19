"use client";

import { motion, useReducedMotion } from "framer-motion";

import { fade, fadeTransition, riseChild, stagger, viewportOnce } from "@/lib/motion";

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
  const reduceMotion = useReducedMotion();
  const trigger =
    active === undefined
      ? ({ whileInView: "shown", viewport: viewportOnce } as const)
      : ({ animate: active ? "shown" : "hidden" } as const);

  // Screen readers get the whole phrase; the pieces below are decorative.
  if (reduceMotion) {
    return (
      <motion.span
        className={className}
        variants={fade}
        initial="hidden"
        transition={fadeTransition(delay)}
        {...trigger}
      >
        {text}
      </motion.span>
    );
  }

  const words = text.split(" ");

  return (
    <motion.span
      className={className}
      variants={stagger(each, delay)}
      initial="hidden"
      {...trigger}
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap" aria-hidden>
          {by === "char" ? (
            [...word].map((char, charIndex) => (
              <span key={charIndex} className="inline-block overflow-hidden align-bottom">
                <motion.span className="inline-block" variants={riseChild}>
                  {char}
                </motion.span>
              </span>
            ))
          ) : (
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span className="inline-block" variants={riseChild}>
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
