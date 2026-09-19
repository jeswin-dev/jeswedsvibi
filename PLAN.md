# Engagement Invitation Site — Design & Build Plan

A private, one-link invitation mini-site for the engagement. Editorial/studio quality,
emerald-and-gold royal palette, fluid scroll-driven animation, live countdown, venue map,
RSVP, and a wishes wall.

Reference direction: `thedigitalyes.com` — a designed mini-site rather than a template,
with cinematic reveals, high-contrast serif typography, and everything (details, map, RSVP)
living on one page.

---

## 1. What I still need from you

Nothing here blocks the build starting — every value below lives in one content file
(`src/content/invitation.ts`) and can be filled or changed in a single place at any time.
I'll use clearly-marked placeholders until you send them.

**Essential**

| Item | Notes |
| --- | --- |
| Couple's names | Exact spelling + the order you want them displayed |
| Engagement date & time | Including timezone, for the countdown and calendar file |
| Venue name & full address | I'll pull the map pin and directions links from this |
| Parents' / families' names | For the formal invitation wording |
| Contact numbers | 1–2 people guests can call, shown near RSVP |

**Nice to have**

| Item | Notes |
| --- | --- |
| The one photo you have | Highest resolution available, unedited if possible |
| A 3–5 sentence "how they met" story | I'll write a draft in the right voice if you'd rather edit than write |
| Day's schedule | e.g. reception 6:00, ceremony 7:00, dinner 8:30 |
| Malayalam blessing line | Or I'll propose one and you approve the wording |
| Dress code | If there is one |
| Domain name | e.g. `jeswedsvibi.com`, or we start on a free `*.vercel.app` URL |
| Music track | Or I'll pick something instrumental and royalty-free |

---

## 2. Design system

### Palette — Emerald & Antique Gold

| Token | Hex | Used for |
| --- | --- | --- |
| `forest` | `#0A1F1A` | Body text on ivory, deepest backgrounds |
| `emerald` | `#0E2A23` | Primary dark sections, hero overlay |
| `emerald-mid` | `#1B4D3E` | Section transitions, card fills, borders on dark |
| `ivory` | `#F7F3EA` | Primary light background |
| `ivory-lift` | `#FCFAF5` | Cards and raised surfaces on ivory |
| `gold` | `#C9A227` | Hairline rules, pins, focus rings, small caps labels |
| `gold-light` | `#E3C978` | Gradient highlight, shimmer sweep on the wax seal |
| `champagne` | `#B08D57` | Muted gold for secondary text on dark |

Rules that keep it looking expensive rather than gaudy: gold appears only as hairlines,
small-caps labels, and single accents — never as a large fill, never as a drop shadow.
Every dark section gets a subtle film grain and a very soft vignette so flat color never
reads as "web default." Contrast is checked to WCAG AA on every text pair.

### Typography

Three families, loaded through `next/font` so there's no layout shift and no external
request at runtime.

- **Display** — `Cormorant Garamond` (light 300, italic available). High-contrast,
  old-world, sets the royal tone. Names, section titles, pull quotes.
- **UI / body** — `Jost` (300/400/500). A geometric sans with wide letter-spacing at
  small sizes for the small-caps labels ("VENUE", "RSVP", "THE DATE").
- **Malayalam** — `Noto Serif Malayalam` for the blessing line and names in Malayalam,
  weight-matched to Cormorant so the two scripts sit together.

Display sizes use `clamp()` so the hero scales fluidly from 360px phones to ultrawide
without breakpoint jumps. Body copy caps at ~68 characters per line.

### Motion language

One consistent feel across the whole site, not a grab-bag of effects:

- **Smooth scroll** via Lenis — weighted, slightly heavy inertia. This single choice is
  most of what makes a site feel "studio."
- **Reveal** — every block enters with a 24px rise plus fade over 900ms on a custom
  ease (`cubic-bezier(0.16, 1, 0.3, 1)`), triggered once at 25% viewport entry.
- **Text** — headings split per word (per character for the hero names) and stagger in
  at 40ms intervals, masked by an overflow-hidden wrapper so letters rise out of nothing.
- **Parallax** — images translate at 0.85× scroll speed inside fixed-ratio frames, so
  they drift within their crop as you pass. Hero does a slow 12s Ken Burns scale.
- **Gold hairlines** draw themselves left-to-right via `scaleX` when their section enters.
- **`prefers-reduced-motion`** is fully honored: Lenis off, transforms replaced with
  plain fades, Ken Burns and shimmer disabled. The site stays beautiful and static.

Performance guardrails: all animation is `transform`/`opacity` only (no layout thrash),
below-fold sections lazy-mount, images are AVIF with explicit dimensions, and the hero
image is `priority`. Target is Lighthouse ≥95 on mobile.

---

## 3. Mobile-first

Most guests will open this from a WhatsApp message on a phone, so the phone is the primary
design target and the desktop layout is the adaptation — not the other way around. Every
section is composed at 390×844 first, then given room to breathe at larger sizes.

**Real full-screen on a phone.** Mobile browsers lie about viewport height: `100vh`
includes the address bar, so a "full screen" hero gets its bottom clipped and then jumps
when the bar hides on scroll. The hero uses `100dvh` with a `100vh` fallback, and all
fixed chrome (music toggle, RSVP pill) is padded by `env(safe-area-inset-*)` so nothing
sits under a notch, a Dynamic Island, or the home indicator.

**It looks like an app, not a web page.** `theme-color` is set to emerald so the browser
chrome blends into the design instead of framing it in grey — this alone is most of the
"full screen" feeling on iOS and Android. A web manifest with `display: standalone` means
that if anyone adds the invitation to their home screen, it opens genuinely full-screen
with no browser UI at all.

**Touch instead of hover.** No interaction depends on hover. Every tappable thing is at
least 44×44px with visible press states; the custom-cursor idea is desktop-only garnish
that simply doesn't render on touch devices.

**Gestures stay native.** Lenis runs with touch smoothing off, so phones keep their own
momentum scrolling — hijacking that is the single fastest way to make a site feel broken
on iOS. Scroll-linked parallax is transform-based, because `background-attachment: fixed`
is unreliable on iOS Safari. `overscroll-behavior` prevents accidental pull-to-refresh
mid-animation.

**The horizontal strip becomes a swipe.** Rather than stacking it into a boring column on
mobile, the atmosphere section turns into a native horizontal scroller with CSS
scroll-snap and a peek of the next card — a familiar, tactile gesture on a phone, and it
costs nothing in JavaScript.

**Typography and layout.** Fluid `clamp()` scales mean no awkward breakpoint jumps; the
display serif stays dramatic on a narrow screen without overflowing. Layout is a single
generous column on mobile, opening into asymmetric offsets only from `md` up.
`overflow-x` is locked at the root so a stray transform can never cause sideways drift.

**Weight budget.** Phones often open this on mobile data at a venue with poor signal, so
the target is under ~500KB for the first screen: responsive AVIF with proper `sizes`,
below-fold sections lazy-mounted, audio fetched only when the music toggle is first used,
and grain rendered as a tiny tiled SVG rather than a large PNG.

Verification is on real hardware, not just a resized desktop window: iOS Safari and
Android Chrome, portrait and landscape, plus a throttled-network pass.

---

## 4. Imagery strategy

You have exactly one photo of them, which actually shapes the design in a good direction.

- **Their photo is the single hero moment** — presented in a tall gold-hairline arch frame
  (a portrait arch handles one image far better than a grid would, and it's period-correct
  for the royal look). It reappears once, smaller, in the story section.
- **No stock photos of people.** Stock couples read as fake instantly and would undercut
  everything else. All supporting imagery is non-human: candlelight, emerald velvet,
  marble, brass, botanicals, architectural arches, bokeh string lights.
- **Texture over photography** where possible — grain overlays, paper fibre, foil
  gradients, and hand-drawn gold botanical line art as SVG (crisp at any size, kilobytes
  instead of megabytes, and animatable as a self-drawing stroke).
- Sources: Unsplash and Pexels only, licenses noted in `public/images/CREDITS.md`.
  Everything gets run through the same emerald-warm color grade so the mixed sources
  look like one shoot.
- Their photo also gets retouch-lite treatment in CSS: a matched grade, subtle vignette,
  and the same grain, so it belongs to the same world.

---

## 5. Page structure

One continuous scroll. Alternating ivory and emerald sections create rhythm and make the
countdown and RSVP feel like arrivals.

**0 — Envelope opening** (every load, including refreshes)
Emerald screen, a gold wax seal with a slow shimmer sweep, monogram initials, and
"Tap to open." The tap breaks the seal, the envelope flaps fold outward, and the hero is
revealed behind it. This tap doubles as the browser gesture that permits audio, so music
can begin softly without ever autoplaying at someone unprompted.

**1 — Hero**
A true full-screen `100dvh` emerald panel with the arch-framed photo, names in large
display serif animating in per character, a gold hairline, the date in small caps, and a
subtle scroll cue pinned above the safe-area inset. On a phone the arch is a tall portrait
that fills the screen; on desktop it centers with wide emerald margins and the ornament
opens out beside it. Persistent from here on: a small music toggle and, past the hero, a
floating RSVP pill — both inset-aware so they clear the home indicator.

**2 — The invitation**
Ivory. The formal wording, families named, centered in a generous measure, framed by
self-drawing gold botanical line art. The Malayalam blessing sits beneath a hairline.

**3 — Countdown**
Emerald. Days / hours / minutes / seconds, each digit in a gold-hairline cell, digits
flipping on change. Computed against a fixed timezone so it's correct for guests abroad,
and it degrades to a graceful "Today is the day" state, then a past-tense message.
Below it: "Add to calendar" (Google Calendar link + `.ics` download).

**4 — Their story**
Ivory. Two or three short movements of copy, offset asymmetrically, with the second
appearance of their photo and botanical art parallaxing at different speeds. A pull quote
in display italic between movements.

**5 — Atmosphere strip**
Textural images (velvet, candles, florals, brass) in a horizontal run. On desktop it
advances as you scroll vertically — the one "showpiece" interaction. On mobile it's a
native swipeable scroller with scroll-snap and a peek of the next card, which feels better
on a phone than a hijacked scroll ever would. With reduced motion it's a plain column.

**6 — Venue, map & schedule**
Emerald. Venue name in display serif, full address, and the map (see §6) inset in a gold
hairline frame. Two large buttons: Google Maps and Apple Maps directions. The day's
schedule is a vertical timeline with gold dots — stacked below the map on mobile, beside
it on desktop.

**7 — RSVP**
Ivory. Name, phone, attending yes/no, and number of guests. On success the form is
replaced in place by a gold seal animation and a thank-you line — no page navigation, no
alert boxes. Contact numbers sit just below for anyone who'd rather call.

**8 — Wishes wall**
Emerald. Messages from guests in a soft masonry of cards — a single column on mobile,
two or three from `md` up — plus a small form (name + wish) to add one. Publishes
instantly; see §6.

**9 — Footer**
Monogram, the date once more, a share button (native share sheet on mobile, copy-link on
desktop), and a quiet credit line.

---

## 6. Data & integrations

### RSVP → Google Sheet

A Next.js route handler (`POST /api/rsvp`) writes a row to a Google Sheet using the
`googleapis` client and a Google service account. You just share the sheet with the
service account's email address; nothing needs to be public.

- Input validated with Zod on the server; nothing trusted from the client.
- A honeypot field plus a minimum time-on-page check stops naive bots.
- Per-IP rate limiting (in-memory, which is sufficient at this traffic level) prevents
  someone spamming 500 rows.
- Duplicate phone numbers update rather than append, so a guest who submits twice doesn't
  double-count your headcount.
- Sheet columns: `Timestamp | Name | Phone | Attending | Guests | Source`.
- On failure the form surfaces a real message and falls back to a WhatsApp link, so an
  API outage never costs you an RSVP.

Secrets live in Vercel environment variables: `GOOGLE_SERVICE_ACCOUNT_EMAIL`,
`GOOGLE_PRIVATE_KEY`, `RSVP_SHEET_ID`. A `.env.example` documents them and real values are
never committed.

### Wishes wall → same Sheet, second tab

Worth flagging a decision here: because you chose the lean RSVP form (no message field),
the wishes wall needs its own small form rather than reusing RSVP. That's the better
outcome anyway — RSVP stays a 20-second task, and wishes become a separate, optional act
further down the page.

Wishes **publish instantly**, with a kill switch you control: every row has a `Hidden`
column that defaults to `FALSE`, and setting it to `TRUE` removes that wish from the site
within a minute. So guests see their message appear immediately, and you can pull anything
down without touching code. To keep the instant path safe, submissions are length-capped,
stripped of links and HTML, rate-limited per IP, and run through a profanity filter before
they're written.

Published wishes are cached for 60 seconds and revalidated, so the sheet is never hit on
every visitor and a hidden wish disappears quickly.

### Map

Google Maps embed (no API key needed for the basic embed), inset in a gold hairline frame
and softened with a CSS filter so it sits in the palette instead of fighting it. It loads
only when scrolled into view, so it costs nothing on first paint. Directions buttons use
universal links that open the native app on both iOS and Android.

### Link previews

Open Graph and Twitter card images generated with `next/og` — the monogram, names, and
date rendered on emerald — so the link unfurls properly in WhatsApp and iMessage.
`robots` is set to `noindex` so the site never appears in search results.

---

## 7. Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js (App Router) + TypeScript | First-class on Vercel, route handlers for RSVP, `next/image` and `next/font` do the heavy lifting |
| Styling | Tailwind CSS with the palette as design tokens | Fast iteration, and tokens keep the palette honest |
| Animation | Framer Motion | Declarative variants, scroll-linked values, built-in reduced-motion support |
| Smooth scroll | Lenis | The single biggest contributor to the "studio" feel |
| Validation | Zod | Shared types between client and server |
| Sheets | `googleapis` | Official client, service-account auth |
| Hosting | Vercel | Push to deploy, preview URLs per commit, free tier is plenty |

No CMS and no database — all content is typed TypeScript in one file, which is the right
call for a site with one event and a handful of fields.

---

## 8. File structure

```
jeswedsvibi/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # fonts, metadata, Lenis + audio providers
│   │   ├── page.tsx                # composes the sections in order
│   │   ├── globals.css             # tokens, grain, base type
│   │   ├── opengraph-image.tsx     # generated share card
│   │   ├── manifest.ts             # standalone display, emerald theme colour
│   │   └── api/
│   │       ├── rsvp/route.ts       # POST → Sheet tab 1
│   │       └── wishes/route.ts     # GET approved, POST new → Sheet tab 2
│   ├── components/
│   │   ├── shell/                  # EnvelopeIntro, SmoothScroll, MusicToggle,
│   │   │                           #   FloatingRsvp, Grain
│   │   ├── sections/               # Hero, Invitation, Countdown, Story,
│   │   │                           #   Atmosphere, Venue, Rsvp, Wishes, Footer
│   │   └── ui/                     # Reveal, SplitText, GoldRule, ArchFrame,
│   │                               #   Button, Field, Ornament (SVG line art)
│   ├── content/
│   │   └── invitation.ts           # ← every name, date, address, and line of copy
│   ├── lib/
│   │   ├── sheets.ts               # service-account client
│   │   ├── schemas.ts              # Zod schemas
│   │   ├── calendar.ts             # .ics + Google Calendar URL
│   │   └── motion.ts               # shared easings, durations, variants
│   └── hooks/
│       ├── useCountdown.ts
│       └── useReducedMotion.ts
├── public/
│   ├── images/                     # graded AVIF assets + CREDITS.md
│   ├── audio/
│   └── fonts/
├── .env.example
└── README.md                       # setup, sheet wiring, how to change content
```

---

## 9. Build order

Each phase ends somewhere you can look at it and react.

1. ~~**Foundation** — Next.js scaffold, tokens, fonts, Lenis, grain, reveal primitives.~~ Done.
2. ~~**Hero + envelope intro** — the make-or-break moment.~~ Done — awaiting review.
3. ~~**Invitation, countdown, verse** — the editorial core, plus calendar export.~~ Done.
4. ~~**Atmosphere strip and venue/map** — the showpiece interaction and directions.~~ Done.
5. ~~**RSVP and wishes** — route handlers, sheet wiring, success and failure states.~~ Done
   (the sheet credentials are still to be added; the site runs without them).
6. **Polish** — share card done. Still to do: real-device check on iOS Safari and Android
   Chrome (where smooth-scroll libraries usually misbehave), a Lighthouse pass, and the
   real photograph.
7. **Deploy** — Vercel project, environment variables, domain.

---

## 10. Decisions already made

| Question | Answer |
| --- | --- |
| Palette | Emerald & antique gold |
| RSVP destination | Google Sheet via a Vercel API route |
| RSVP fields | Name, phone, attending, guest count |
| Map | Google Maps embed, palette-graded, with directions buttons |
| Imagery | Their one photo as the centerpiece; non-human stock and SVG ornament elsewhere |
| Extras | Envelope intro, ambient music toggle, rich link previews, wishes wall |
| Language | English with Malayalam accents |
| Wishes wall | Publish instantly, with a `Hidden` kill switch in the sheet |
| Privacy | Unlisted and `noindex`, no passcode gate |
| Monogram | Custom mark: interlocked initials woven with a botanical flourish, drawn as SVG |
| Review | Foundation and hero first, then pause for review |
