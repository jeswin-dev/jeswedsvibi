"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { revealTransition, revealUp, viewportOnce } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "p";
  /** Drive the animation from state instead of scroll position. */
  active?: boolean;
};

export function Reveal({ children, delay = 0, className, as = "div", active }: RevealProps) {
  const Component = motion[as];
  const trigger =
    active === undefined
      ? ({ whileInView: "shown", viewport: viewportOnce } as const)
      : ({ animate: active ? "shown" : "hidden" } as const);

  return (
    <Component
      className={className}
      variants={revealUp}
      initial="hidden"
      transition={revealTransition(delay)}
      {...trigger}
    >
      {children}
    </Component>
  );
}
