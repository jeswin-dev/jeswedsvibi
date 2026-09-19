/**
 * Section textures, built as data-URI backgrounds so they render on the server,
 * ship no JavaScript, and stay crisp at any zoom. A flat colour fill is what
 * makes a page read as a website; these are what make it read as cloth.
 */

const TILE = { width: 120, height: 160 };

/** A damask motif: an ogee frame around a palmette. */
const MOTIF = `
  <path d='M60 28C86 52 92 84 60 132C28 84 34 52 60 28Z' stroke-opacity='0.75'/>
  <path d='M60 48C76 64 80 88 60 118C40 88 44 64 60 48Z' stroke-opacity='0.5'/>
  <path d='M60 58V112' stroke-opacity='0.45'/>
  ${[70, 84, 98]
    .map(
      (y, index) => `
    <g stroke-opacity='${(0.45 - index * 0.08).toFixed(2)}'>
      <path d='M60 ${y}C53 ${y - 2} 49 ${y + 4} 50 ${y + 9}C57 ${y + 8} 60 ${y + 4} 60 ${y}Z'/>
      <path d='M60 ${y}C67 ${y - 2} 71 ${y + 4} 70 ${y + 9}C63 ${y + 8} 60 ${y + 4} 60 ${y}Z'/>
    </g>`,
    )
    .join("")}
  <circle cx='60' cy='24' r='2' stroke-opacity='0.6'/>
  <circle cx='60' cy='138' r='1.5' stroke-opacity='0.45'/>
`;

/** Corner copies interlock the tiles into a continuous half-drop lattice. */
const OFFSETS = [
  [0, 0],
  [-TILE.width / 2, -TILE.height / 2],
  [TILE.width / 2, -TILE.height / 2],
  [-TILE.width / 2, TILE.height / 2],
  [TILE.width / 2, TILE.height / 2],
];

function damaskUrl(stroke: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${TILE.width}' height='${TILE.height}' viewBox='0 0 ${TILE.width} ${TILE.height}'>
    <g fill='none' stroke='${stroke}' stroke-width='1' stroke-linecap='round'>
      ${OFFSETS.map(([x, y]) => `<g transform='translate(${x} ${y})'>${MOTIF}</g>`).join("")}
    </g>
  </svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

const DAMASK_GOLD = damaskUrl("#c9a227");
const DAMASK_FOREST = damaskUrl("#0a1f1a");

type DamaskProps = {
  className?: string;
  /** Tile width in pixels. Smaller reads as finer cloth. */
  scale?: number;
  tone?: "gold" | "forest";
};

export function Damask({ className = "", scale = 150, tone = "gold" }: DamaskProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: tone === "gold" ? DAMASK_GOLD : DAMASK_FOREST,
        backgroundSize: `${scale}px ${(scale * TILE.height) / TILE.width}px`,
      }}
      aria-hidden
    />
  );
}

const PAPER = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>
    <filter id='p'>
      <feTurbulence type='fractalNoise' baseFrequency='0.55 0.9' numOctaves='4' stitchTiles='stitch'/>
      <feColorMatrix type='saturate' values='0'/>
    </filter>
    <rect width='220' height='220' filter='url(#p)'/>
  </svg>`,
)}")`;

/** Fibrous mottling so the ivory sections read as paper. */
export function Paper({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply ${className}`}
      style={{ backgroundImage: PAPER, backgroundSize: "220px 220px" }}
      aria-hidden
    />
  );
}
