"use client";

import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";

import { useGentleMotion } from "@/hooks/useGentleMotion";
import { Monogram } from "@/components/ui/Monogram";
import { Crest } from "@/components/ui/ornaments";
import { Damask, Velvet } from "@/components/ui/textures";
import { invitation } from "@/content/invitation";
import { ease } from "@/lib/motion";

import { useIntro } from "./intro-context";

const { couple } = invitation;

export function EnvelopeIntro() {
  const { opened, open } = useIntro();
  const reduceMotion = useGentleMotion();
  const lenis = useLenis();
  const [dismissed, setDismissed] = useState(false);

  const partDuration = reduceMotion ? 0.5 : 1.5;

  useEffect(() => {
    if (opened) return;
    lenis?.stop();
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    return () => lenis?.start();
  }, [lenis, opened]);

  useEffect(() => {
    if (!opened) return;
    lenis?.start();
    const timer = window.setTimeout(() => setDismissed(true), partDuration * 1000 + 150);
    return () => window.clearTimeout(timer);
  }, [lenis, opened, partDuration]);

  if (dismissed) return null;

  return (
    <div className={`fixed inset-0 z-40 ${opened ? "pointer-events-none" : ""}`}>
      {([-1, 1] as const).map((direction) => (
        <motion.div
          key={direction}
          className="absolute top-0 h-full w-1/2 overflow-hidden bg-emerald"
          initial={{ x: "0%" }}
          animate={{ x: opened ? `${direction * 101}%` : "0%" }}
          transition={{ duration: partDuration, ease }}
          style={{ left: direction === -1 ? 0 : "50%" }}
          aria-hidden
        >
          <Velvet className="opacity-50 mix-blend-overlay" />
          <Damask className="opacity-[0.09]" scale={140} />
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background:
                direction === -1
                  ? "radial-gradient(120% 90% at 100% 50%, rgba(27,77,62,0.55), transparent 65%)"
                  : "radial-gradient(120% 90% at 0% 50%, rgba(27,77,62,0.55), transparent 65%)",
            }}
          />
          <div
            className="absolute inset-y-0 w-px"
            style={{
              right: direction === -1 ? 0 : undefined,
              left: direction === 1 ? 0 : undefined,
              background:
                "linear-gradient(to bottom, transparent 22%, rgba(201,162,39,0.55) 46%, rgba(201,162,39,0.55) 54%, transparent 78%)",
            }}
          />
        </motion.div>
      ))}

      <motion.button
        type="button"
        onClick={open}
        disabled={opened}
        className="absolute inset-0 flex flex-col items-center justify-center gap-7 px-6 text-center"
        animate={opened ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease }}
      >
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.25 }}
        >
          <Crest className="h-8 w-[4.5rem] opacity-90" />
          <span className="label text-gold/75">You are invited</span>
        </motion.div>

        <span className="relative inline-flex size-44 items-center justify-center sm:size-52">
          {/* Photographed wax, then a dark wash so the blank disc reads as metal. */}
          <span
            className="absolute inset-0 rounded-full shadow-[0_22px_50px_-16px_rgba(0,0,0,0.75)]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 35% 28%, rgba(227,201,120,0.28), rgba(10,31,26,0.55) 62%), url('/images/wax-blank.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <span className="absolute inset-[7%] rounded-full border border-gold/35" />
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <motion.span
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold-light/30 to-transparent"
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
          className="label text-ivory/65"
          animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          Tap to open
        </motion.span>
      </motion.button>
    </div>
  );
}
