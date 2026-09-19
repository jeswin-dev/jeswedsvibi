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

Until then the arch shows `couple-placeholder.jpg`. The four images in the evening strip are
deliberately textural — candlelight, roses, an arch, velvet — and contain no people, because
stock photos of other couples would undercut the real photograph beside them.

## Music

Optional and silent until configured. Put a track in `public/audio/` and set `audioSrc` in
the content file; the toggle only appears when a track exists. Sound is unlocked by the tap
that opens the envelope, so it never autoplays at anyone.

## Collecting RSVPs

RSVP replies and wishes are appended to a Google Sheet. Until the three environment
variables exist the site still works: the RSVP form asks guests to call or WhatsApp instead,
and the wishes wall stays closed. Nothing breaks, so this can be set up at any point.

### 1. Create the sheet

Make a new Google Sheet and create two tabs, named exactly `RSVP` and `Wishes`.

Put these headers in row 1 of `RSVP`:

| A | B | C | D | E |
| --- | --- | --- | --- | --- |
| Timestamp | Name | Phone | Attending | Guests |

And these in row 1 of `Wishes`:

| A | B | C | D |
| --- | --- | --- | --- |
| Timestamp | Name | Message | Hidden |

Copy the sheet id out of the URL — it's the long string between `/d/` and `/edit`.

### 2. Create a service account

This is a robot account that writes rows for you. It cannot read anything else in your
Drive.

1. Go to [console.cloud.google.com](https://console.cloud.google.com) and create a project
   (any name).
2. In **APIs & Services → Library**, search for **Google Sheets API** and enable it.
3. In **APIs & Services → Credentials**, choose **Create credentials → Service account**,
   give it a name like `invitation-writer`, and create it.
4. Open the new service account, go to the **Keys** tab, and choose **Add key → Create new
   key → JSON**. A `.json` file downloads. Keep it private — it is a password.

### 3. Share the sheet with it

Open the JSON file and find `client_email` (it ends in `.iam.gserviceaccount.com`). Back in
the Google Sheet, press **Share**, paste that address, and give it **Editor** access.

This step is the one people forget. Without it, every write fails with a permission error.

### 4. Add the three variables

Copy `.env.example` to `.env.local` and fill in:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL` — the `client_email` from the JSON.
- `GOOGLE_PRIVATE_KEY` — the `private_key` from the JSON, in double quotes, keeping the
  `\n` escapes exactly as they appear.
- `RSVP_SHEET_ID` — the id from step 1.

Add the same three in Vercel under **Project → Settings → Environment Variables**, then
redeploy. Restart `npm run dev` after changing `.env.local`.

### Reading and moderating

RSVP rows arrive in the `RSVP` tab as they come in. A guest who submits twice creates two
rows, so sort by phone if you need to reconcile.

Wishes publish to the site immediately. To take one down, set its `Hidden` cell to `TRUE`;
it disappears within a minute. Submissions are already length-capped, stripped of links and
HTML, rate-limited per visitor, and refused outright if they contain abuse.

## Deploying

Import the repo into Vercel — no configuration needed. Add the environment variables above
if RSVP is wired up, and set `NEXT_PUBLIC_SITE_URL` to the final domain so the WhatsApp and
iMessage link previews point at the right place.

The site is `noindex`, so it will not appear in search results. Anyone with the link can
open it.

## Build phases

Done: foundation, wax-seal intro, hero, invitation, countdown, verse, evening strip, venue
and map, RSVP, wishes wall, footer, share card.

Remaining: the real photograph, optional music, a custom domain, and a pass on real devices.
