"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { GoldRule } from "@/components/ui/GoldRule";
import { Reveal } from "@/components/ui/Reveal";
import { Damask } from "@/components/ui/textures";
import { invitation } from "@/content/invitation";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const { atmosphere } = invitation;

type Item = (typeof atmosphere.items)[number];

function Card({ item, sizes }: { item: Item; sizes: string }) {
  return (
    <figure className="relative shrink-0">
      <div className="relative aspect-3/4 w-[68vw] overflow-hidden border border-gold/30 sm:w-[52vw] md:w-96">
        <Image src={item.src} alt={item.alt} fill sizes={sizes} className="object-cover" />
        <div
          className="pointer-events-none absolute inset-0 bg-emerald/20 mix-blend-soft-light"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald/70 via-transparent to-transparent"
          aria-hidden
        />
      </div>
      <figcaption className="label mt-4 text-center text-[0.5625rem] text-champagne">
        {item.caption}
      </figcaption>
    </figure>
  );
}

function Heading() {
  return (
    <div className="flex flex-col items-center px-6 text-center">
      <Reveal>
        <p className="label text-gold/70">{atmosphere.eyebrow}</p>
      </Reveal>
      <GoldRule ornament className="mt-5 w-28" delay={0.2} />
    </div>
  );
}

/** Phones get a native swipe with scroll-snap, which beats a hijacked scroll. */
function SwipeStrip() {
  return (
    <section className="relative isolate overflow-hidden bg-emerald py-20">
      <Damask className="opacity-[0.05]" scale={118} />
      <div className="relative">
        <Heading />
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {atmosphere.items.map((item) => (
            <div key={item.src} className="snap-center">
              <Card item={item} sizes="(max-width: 640px) 68vw, 52vw" />
            </div>
          ))}
          {/* Trailing spacer so the last card can centre itself. */}
          <div className="w-[12vw] shrink-0" aria-hidden />
        </div>
      </div>
    </section>
  );
}

/**
 * Desktop pins the section and advances the row sideways as you scroll down.
 * No ancestor here may clip overflow, or `sticky` silently stops working.
 */
function PinnedStrip() {
  const track = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  /**
   * The row travels exactly its own overflow, measured rather than guessed: a
   * fixed percentage either runs the cards off the edge or barely moves them,
   * depending on the window.
   */
  useEffect(() => {
    const measure = () => {
      if (!row.current) return;
      setDistance(Math.max(0, row.current.scrollWidth - window.innerWidth));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <section className="relative isolate bg-emerald">
      <Damask className="opacity-[0.05]" scale={118} />
      {/* Only as tall as the sideways travel needs, so nothing is pinned for
          longer than it has content to reveal. */}
      <div ref={track} className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
        <div className="sticky top-0 flex h-screen-safe flex-col justify-center overflow-hidden py-16">
          <Heading />
          <motion.div
            ref={row}
            style={{ x }}
            className="mt-12 flex w-max gap-8 px-[8vw] will-change-transform"
          >
            {atmosphere.items.map((item) => (
              <Card key={item.src} item={item} sizes="24rem" />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Atmosphere() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduceMotion = useReducedMotion();

  return isDesktop && !reduceMotion ? <PinnedStrip /> : <SwipeStrip />;
}
