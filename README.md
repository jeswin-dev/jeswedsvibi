# Jesme & Vibin — Engagement Invitation

A private, one-link invitation mini-site. Mobile-first, emerald and antique gold, with a
wax-seal intro, live countdown, venue map, RSVP and a wishes wall.

See [`PLAN.md`](./PLAN.md) for the full design and build plan.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Changing any detail

Everything — names, the date, the venue, the families, the verse, the contact number — lives
in one file: [`src/content/invitation.ts`](./src/content/invitation.ts). Edit there and the
whole site updates.

The date is stored with an explicit UTC offset (`+05:30`), so the countdown is correct for a
guest in Kochi and one in Toronto alike.

## The photograph

Drop the real photo into `public/images/` and point `photo.src` at it. Portrait orientation
works best, since it sits inside a tall arch.

Until then the arch shows `couple-placeholder.jpg`.

## Music

A short looping excerpt of Erik Satie's *Gymnopédie No. 1* starts when the envelope
is opened. The recording is Kevin MacLeod's (CC BY 3.0, royalty-free); the corner
toggle mutes it. To swap the track, replace `public/audio/gymnopedie-loop.m4a` and
point `audioSrc` at the new file.

## Saving the wishes

Wishes are stored in Upstash Redis. Until it is connected the site still works: the wall
shows its empty state and the form says wishes are not open yet. Nothing breaks, so this can
be set up whenever.

### Connect it (about two minutes)

1. Open the project in Vercel and go to the **Storage** tab.
2. Choose **Create Database → Upstash → Redis**, pick the region closest to Kerala, and
   create it on the free plan.
3. Accept the prompt to connect it to this project.

That is the whole setup. Vercel writes `UPSTASH_REDIS_REST_URL` and
`UPSTASH_REDIS_REST_TOKEN` into the project itself, so there is no key to copy, no JSON file
to keep safe, and nothing to share with a robot account. Redeploy once and the wall is live.

To run the wall on your own machine too, copy those two values from the database's
**.env** tab into a local `.env.local`, then restart `npm run dev`.

### Reading and moderating

Open the database in Vercel (or at [console.upstash.com](https://console.upstash.com)) and
use the **Data Browser**. Two keys hold everything:

- `wishes` — every wish from the wall.
- `rsvps` — replies, once the RSVP fold comes back.

Each key is a hash whose fields are individual entries, so you can read them one by one and
delete a single wish with the field's delete button. That is deliberate: a Redis list would
have forced you into command-line surgery to remove one entry.

A deleted wish leaves the site within a minute, since the wall caches for 60 seconds. If you
would rather hide a wish without losing what it said, edit its JSON and add `"hidden": true`.

Wishes publish instantly, so the safeguards run before anything is stored: length limits,
HTML and links stripped out, per-visitor rate limiting, and outright refusal of abuse.

## Deploying

Import the repo into Vercel — no configuration needed. Add Upstash from the Storage tab when
you want the wishes wall live, and set `NEXT_PUBLIC_SITE_URL` to the final domain so the
WhatsApp and iMessage link previews point at the right place.

The site is `noindex`, so it will not appear in search results. Anyone with the link can
open it.

## Build phases

Live: wax-seal intro, hero, invitation, countdown, verse, venue and map, wishes wall, footer,
share card.

Parked but built — one line in `src/app/page.tsx` away from returning:

- The **RSVP fold** (`src/components/sections/Rsvp.tsx`), its route handler, and the floating
  RSVP pill in `src/app/layout.tsx`.

Remaining: the real photograph, a custom domain, and a pass on real devices.
