"use client";

import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";

import { useIntro } from "@/components/shell/intro-context";
import { ease } from "@/lib/motion";

/**
 * Appears once the hero is behind you and retires at the RSVP fold itself,
 * where it would otherwise cover the form it points at.
 */
export function FloatingRsvp() {
  const { opened } = useIntro();
  const { scrollY } = useScroll();
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (value) => {
      const target = document.getElementById("rsvp");
      const reachedRsvp = target ? value + window.innerHeight > target.offsetTop + 160 : false;
      setVisible(value > window.innerHeight * 0.9 && !reachedRsvp);
    });
    return unsubscribe;
  }, [scrollY]);

  return (
    <AnimatePresence>
      {opened && visible ? (
        <motion.button
          type="button"
          onClick={() => lenis?.scrollTo("#rsvp", { offset: -40 })}
          className="label fixed right-4 bottom-[max(env(safe-area-inset-bottom),1rem)] z-30 min-h-12 border border-gold/45 bg-emerald/85 px-5 py-3 text-gold-light shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)] backdrop-blur-sm sm:right-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease }}
        >
          RSVP
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
