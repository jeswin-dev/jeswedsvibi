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
 * never arrives unannounced.
 */
export function MusicToggle() {
  const { opened } = useIntro();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const src = invitation.audioSrc;

  useEffect(() => {
    if (!src || !opened) return;
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.35;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [opened, src]);

  if (!src) return null;

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <motion.button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Mute music" : "Play music"}
        className="fixed top-[max(env(safe-area-inset-top),1rem)] right-4 z-30 flex size-11 items-center justify-center rounded-full border border-gold/35 bg-emerald/70 backdrop-blur-sm sm:right-6"
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
