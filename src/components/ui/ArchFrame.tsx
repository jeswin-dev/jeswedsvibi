"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useId } from "react";

import { useGentleMotion } from "@/hooks/useGentleMotion";
import { ease } from "@/lib/motion";

type ArchFrameProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  kenBurns?: boolean;
};

/**
 * Three gold horseshoes, kept visible on purpose. They soften only at the
 * very foot so the ends read as a finish rather than a cut border.
 */
function ArchRings() {
  const fadeId = useId().replace(/:/g, "");

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      viewBox="0 0 300 400"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${fadeId}-stroke`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3c978" stopOpacity="0.7" />
          <stop offset="72%" stopColor="#c9a227" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <path
        d="M -22 400 V 150 A 172 172 0 0 1 322 150 V 400"
        stroke={`url(#${fadeId}-stroke)`}
        strokeWidth="1.15"
      />
      <path
        d="M -10 400 V 150 A 160 160 0 0 1 310 150 V 400"
        stroke={`url(#${fadeId}-stroke)`}
        strokeWidth="1.5"
        strokeOpacity="0.85"
      />
      <path
        d="M 1.5 400 V 150 A 148.5 148.5 0 0 1 298.5 150 V 400"
        stroke={`url(#${fadeId}-stroke)`}
        strokeWidth="2.1"
      />
    </svg>
  );
}

export function ArchFrame({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 78vw, 30vw",
  kenBurns = false,
}: ArchFrameProps) {
  const reduceMotion = useGentleMotion();
  const drift = kenBurns && !reduceMotion;

  return (
    <div className={`relative ${className}`}>
      <ArchRings />

      <div
        className="relative h-full w-full overflow-hidden rounded-t-full"
        style={{
          // Only the photograph dissolves. The gold arches stay on top of it.
          WebkitMaskImage: "linear-gradient(to bottom, #000 52%, transparent 92%)",
          maskImage: "linear-gradient(to bottom, #000 52%, transparent 92%)",
        }}
      >
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

        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[42%] rounded-t-full"
          style={{
            boxShadow: "inset 0 1px 0 rgba(227,201,120,0.35)",
            background:
              "radial-gradient(120% 80% at 50% -10%, rgba(227,201,120,0.16), transparent 55%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-emerald/25 mix-blend-soft-light"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald/50 via-emerald/15 to-transparent"
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
    </div>
  );
}
