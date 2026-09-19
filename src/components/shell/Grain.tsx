const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/>
        <feColorMatrix type='saturate' values='0'/>
      </filter>
      <rect width='180' height='180' filter='url(#n)'/>
    </svg>`,
  );

/**
 * A film grain over the whole page. Flat colour is what makes a site read as
 * "web default"; this is a few hundred bytes and fixes it everywhere at once.
 */
export function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-overlay"
      style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "180px 180px" }}
      aria-hidden
    />
  );
}
