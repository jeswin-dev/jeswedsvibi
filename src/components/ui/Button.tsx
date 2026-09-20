"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Tone = "gold" | "outlineLight" | "outlineDark" | "solidDark";

/**
 * Tones are whole looks rather than something to patch with extra classes:
 * Tailwind resolves competing utilities by stylesheet order, not class order,
 * so overriding a tone's background from the outside silently loses.
 */
const tones: Record<Tone, string> = {
  gold: "border-gold/70 bg-gold/12 text-gold-light hover:bg-gold/20",
  outlineLight: "border-ivory/25 text-ivory/85 hover:border-ivory/50 hover:bg-ivory/5",
  outlineDark: "border-champagne/40 text-forest hover:border-champagne hover:bg-champagne/10",
  solidDark: "border-forest bg-forest text-ivory hover:border-emerald hover:bg-emerald",
};

/** Min height keeps every tap target comfortably above 44px on a phone. */
const base =
  "label inline-flex min-h-12 items-center justify-center gap-2 border px-6 py-3 transition-colors duration-300 active:scale-[0.99] disabled:opacity-50";

type ButtonProps = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
};

export function Button({
  children,
  tone = "gold",
  className = "",
  ...props
}: ButtonProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button className={`${base} ${tones[tone]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  tone = "gold",
  className = "",
  ...props
}: ButtonProps & ComponentPropsWithoutRef<"a">) {
  return (
    <a className={`${base} ${tones[tone]} ${className}`} {...props}>
      {children}
    </a>
  );
}
