"use client";

import { motion } from "framer-motion";

import { useGentleMotion } from "@/hooks/useGentleMotion";import Image from "next/image";

import { ease } from "@/lib/motion";

type ArchFrameProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Slow scale drift. Only for the hero; elsewhere it's distracting. */
  kenBurns?: boolean;
  /** Gradient stops used to dissolve the base of the arch into its section. */
  dissolveClassName?: string;
};

export function ArchFrame({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 78vw, 30vw",
  kenBurns = false,
  dissolveClassName = "from-emerald via-emerald/80",
}: ArchFrameProps) {
  const reduceMotion = useGentleMotion();
  const drift = kenBurns && !reduceMotion;

  return (
    <div className={`relative ${className}`}>
      {/* Two offset hairlines give the frame depth without a heavy border. */}
      <div
        className="pointer-events-none absolute -inset-2 rounded-t-full border border-b-0 border-gold/20 sm:-inset-3"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -inset-5 rounded-t-full border border-b-0 border-gold/10 sm:-inset-7"
        aria-hidden
      />

      {/* No bottom border: the image dissolves into the section instead of
          ending on a hard line. */}
      <div className="relative h-full w-full overflow-hidden rounded-t-full border border-b-0 border-gold/45">
        <motion.div
          className="absolute inset-0"
          initial={drift ? { scale: 1.02 } : false}
          animate={drift ? { scale: 1.12 } : undefined}
          transition={{ duration: 24, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover"
          />
        </motion.div>

        {/* Shared grade: warms mixed sources into one look and seats the type. */}
        <div
          className="pointer-events-none absolute inset-0 bg-emerald/25 mix-blend-soft-light"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald via-emerald/15 to-transparent"
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_28px_rgba(10,31,26,0.55)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease }}
          aria-hidden
        />
      </div>

      {/* Wider than the frame so the hairlines dissolve with the photograph
          instead of stopping on a visible edge. */}
      <div
        className={`pointer-events-none absolute -inset-x-8 -bottom-8 h-[40%] bg-gradient-to-t to-transparent ${dissolveClassName}`}
        aria-hidden
      />
    </div>
  );
}
