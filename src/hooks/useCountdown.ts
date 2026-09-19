"use client";

import { useEffect, useState } from "react";

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True from the start of the event onwards. */
  isPast: boolean;
  /** True on the day itself, before the start time. */
  isToday: boolean;
  /** False until the first client tick, so server and client markup agree. */
  ready: boolean;
};

const EMPTY: Countdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isPast: false,
  isToday: false,
  ready: false,
};

function compute(target: number): Countdown {
  const remaining = target - Date.now();

  if (remaining <= 0) {
    return { ...EMPTY, isPast: true, ready: true };
  }

  const seconds = Math.floor(remaining / 1000);

  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    isPast: false,
    isToday: remaining < 86400000,
    ready: true,
  };
}

/**
 * Counts down to an absolute instant. The target carries its own UTC offset, so
 * the result is identical for a guest in Kochi and one in Toronto.
 */
export function useCountdown(iso: string): Countdown {
  const [state, setState] = useState<Countdown>(EMPTY);

  useEffect(() => {
    const target = new Date(iso).getTime();

    // First value immediately, then aligned to the next second boundary so the
    // digits do not drift visibly over a long visit.
    setState(compute(target));
    const interval = window.setInterval(() => setState(compute(target)), 1000);
    return () => window.clearInterval(interval);
  }, [iso]);

  return state;
}
