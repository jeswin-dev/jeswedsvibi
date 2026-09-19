"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";

import { Monogram } from "@/components/ui/Monogram";
import { ease } from "@/lib/motion";
import { invitation } from "@/content/invitation";

import { useIntro } from "./intro-context";

const { couple } = invitation;

export function EnvelopeIntro() {
  const { opened, open } = useIntro();
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();
  const [dismissed, setDismissed] = useState(false);

  const partDuration = reduceMotion ? 0.5 : 1.5;

  // Hold the page still until the envelope is open. A refresh can restore a
  // previous scroll position, so reset it too.
  useEffect(() => {
    if (opened) return;
    lenis?.stop();
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    return () => lenis?.start();
  }, [lenis, opened]);

  // Remove the overlay from the tree once the halves are off screen.
  useEffect(() => {
    if (!opened) return;
    lenis?.start();
    const timer = window.setTimeout(() => setDismissed(true), partDuration * 1000 + 150);
    return () => window.clearTimeout(timer);
  }, [lenis, opened, partDuration]);

  if (dismissed) return null;

  return (
    <div className={`fixed inset-0 z-40 ${opened ? "pointer-events-none" : ""}`}>
      {/* Two halves of the envelope part to reveal the hero behind. */}
      {([-1, 1] as const).map((direction) => (
        <motion.div
          key={direction}
          className="absolute top-0 h-full w-1/2 bg-emerald"
          initial={{ x: "0%" }}
          animate={{ x: opened ? `${direction * 101}%` : "0%" }}
          transition={{ duration: partDuration, ease }}
          style={{ left: direction === -1 ? 0 : "50%" }}
          aria-hidden
        >
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                direction === -1
                  ? "radial-gradient(120% 90% at 100% 50%, rgba(27,77,62,0.55), transparent 65%)"
                  : "radial-gradient(120% 90% at 0% 50%, rgba(27,77,62,0.55), transparent 65%)",
            }}
          />
          {/* The seam glows where the seal sits and fades towards the edges,
              rather than ruling a hard line down the whole screen. */}
          <div
            className="absolute inset-y-0 w-px"
            style={{
              right: direction === -1 ? 0 : undefined,
              left: direction === 1 ? 0 : undefined,
              background:
                "linear-gradient(to bottom, transparent 22%, rgba(201,162,39,0.4) 46%, rgba(201,162,39,0.4) 54%, transparent 78%)",
            }}
          />
        </motion.div>
      ))}

      <motion.button
        type="button"
        onClick={open}
        disabled={opened}
        className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6 text-center"
        animate={opened ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease }}
      >
        <motion.span
          className="label text-gold/70"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.3 }}
        >
          You are invited
        </motion.span>

        {/* The wax seal: an opaque disc that hides the join, the monogram, and a
            slow shimmer sweep. */}
        <span className="relative inline-flex size-44 items-center justify-center sm:size-52">
          <span className="absolute inset-0 rounded-full bg-emerald shadow-[inset_0_1px_0_rgba(227,201,120,0.25),0_18px_40px_-18px_rgba(0,0,0,0.7)]" />
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_28%,rgba(227,201,120,0.26),rgba(10,31,26,0.95)_72%)]" />
          <span className="absolute inset-0 rounded-full border border-gold/30" />
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <motion.span
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold-light/25 to-transparent"
              initial={{ x: "-150%" }}
              animate={reduceMotion ? undefined : { x: "350%" }}
              transition={{
                duration: 3.4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 1.6,
              }}
            />
          </span>
          <Monogram
            initials={[couple.one.initial, couple.two.initial]}
            className="relative size-full"
            delay={0.5}
          />
        </span>

        <motion.span
          className="label text-ivory/60"
          animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          Tap to open
        </motion.span>
      </motion.button>
    </div>
  );
}
