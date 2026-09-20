"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useIntro } from "@/components/shell/intro-context";
import { invitation } from "@/content/invitation";
import { ease } from "@/lib/motion";

const BARS = [0.45, 1, 0.65, 0.85];

/**
 * Renders only when a track is configured. Playback is started by the tap that
 * opens the envelope, which is also the gesture browsers require — so sound
 * never arrives unannounced. It also pauses whenever the tab is in the
 * background, and resumes only if the guest had left it on.
 */
export function MusicToggle() {
  const { opened, musicRef } = useIntro();
  const [playing, setPlaying] = useState(false);
  const wantedRef = useRef(false);
  const src = invitation.audioSrc;

  useEffect(() => {
    const audio = musicRef.current;
    if (!audio) return;

    audio.volume = 0.35;
    const onPlay = () => {
      wantedRef.current = true;
      setPlaying(true);
    };
    const onPause = () => setPlaying(false);

    const syncToVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (!audio.paused) audio.pause();
        return;
      }
      if (wantedRef.current && audio.paused) {
        void audio.play().catch(() => {});
      }
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", syncToVisibility);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", syncToVisibility);
    };
  }, [musicRef, src]);

  if (!src) return null;

  function toggle() {
    const audio = musicRef.current;
    if (!audio) return;

    if (audio.paused) {
      wantedRef.current = true;
      void audio.play().catch(() => {
        wantedRef.current = false;
      });
    } else {
      wantedRef.current = false;
      audio.pause();
    }
  }

  return (
    <>
      <audio ref={musicRef} src={src} loop preload="auto" playsInline />
      <motion.button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Mute music" : "Play music"}
        className={`fixed top-[max(env(safe-area-inset-top),1rem)] right-4 z-30 flex size-11 items-center justify-center rounded-full border border-gold/35 bg-emerald/70 backdrop-blur-sm sm:right-6 ${
          opened ? "" : "pointer-events-none"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ duration: 0.8, ease, delay: 2.4 }}
      >
        <span className="flex h-3.5 items-end gap-[3px]" aria-hidden>
          {BARS.map((height, index) => (
            <motion.span
              key={index}
              className="w-[2px] bg-gold-light"
              style={{ height: `${height * 100}%` }}
              animate={playing ? { scaleY: [0.4, 1, 0.55, 0.9, 0.4] } : { scaleY: 0.3 }}
              transition={
                playing
                  ? { duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.12 }
                  : { duration: 0.3 }
              }
            />
          ))}
        </span>
      </motion.button>
    </>
  );
}
