"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Weighted inertial scrolling on pointer devices. Touch smoothing stays off on
 * purpose: phones keep their native momentum, which no library improves on.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.085,
        wheelMultiplier: 0.9,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
