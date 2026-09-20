import type { ReactNode } from "react";

const FOIL = "url('/images/gold-foil.jpg')";

/**
 * Real gold-leaf texture clipped to the letterforms, rather than a flat gold
 * fill. On ivory the same leaf is darkened by a translucent bronze wash layered
 * over it, because bright foil on cream has almost no contrast.
 */
const tones = {
  gold: {
    backgroundImage: `linear-gradient(rgba(255,240,200,0.18), rgba(140,104,26,0.1)), ${FOIL}`,
  },
  bronze: {
    backgroundImage: `linear-gradient(rgba(62,42,8,0.5), rgba(62,42,8,0.5)), ${FOIL}`,
  },
} as const;

type FoilTextProps = {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
  as?: "span" | "div";
};

export function FoilText({ children, tone = "gold", className = "", as = "span" }: FoilTextProps) {
  const Component = as;

  return (
    <Component
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        ...tones[tone],
        backgroundSize: "180% 180%",
        backgroundPosition: "center",
      }}
    >
      {children}
    </Component>
  );
}
