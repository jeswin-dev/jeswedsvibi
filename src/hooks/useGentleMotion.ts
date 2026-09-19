"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Like `useReducedMotion`, but false until after hydration.
 *
 * The server cannot know a visitor's motion preference, so any markup or inline
 * style that branches on it mismatches on hydration and React discards the
 * tree. Deferring the switch by one commit costs a single frame of animation for
 * reduced-motion visitors and keeps hydration clean for everyone.
 */
export function useGentleMotion() {
  const prefersReduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  return hydrated && Boolean(prefersReduced);
}
