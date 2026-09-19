/**
 * Every piece of copy and every detail on the site lives here.
 * Anything marked TODO is a placeholder waiting on real details.
 */

export const invitation = {
  couple: {
    // `first` is what the hero shows; `full` is for the formal wording.
    one: { first: "Jesme", full: "Jesme Eldho", initial: "J" },
    two: { first: "Vibin", full: "Vibin Paul", initial: "V" },
  },

  // Stored with an explicit offset so the countdown is correct for guests abroad.
  date: {
    iso: "2026-10-26T18:30:00+05:30",
    timeZone: "Asia/Kolkata",
    display: "26 October 2026",
    dayOfWeek: "Monday",
    time: "6:30 in the evening onwards",
    timeShort: "6:30 PM onwards",
  },

  venue: {
    name: "Seema Auditorium",
    area: "Perumbavoor",
    city: "Ernakulam, Kerala",
    addressLines: [
      "Seema Auditorium Road, Pathipalam",
      "Perumbavoor, Ernakulam",
      "Kerala 683500",
    ],
    // Resolved from the shared Google Maps pin, so directions land exactly right.
    coords: { lat: 10.1094907, lng: 76.4767437 },
    mapQuery: "Seema Auditorium, Perumbavoor, Ernakulam, Kerala",
  },

  hero: {
    eyebrow: "Together with our families",
    connector: "and",
    scrollCue: "Scroll",
  },

  /** The formal invitation wording, one block per family. */
  invite: {
    eyebrow: "The Engagement",
    lead: "With joyful hearts and the blessings of our families, we invite you to the engagement of",
    closing: "Your presence and prayers would mean the world to us.",
  },

  families: {
    one: {
      name: "Jesme Eldho",
      relation: "Daughter of",
      parents: "Dr. Eldho P. Varghese & Mrs. Meena M. Abraham",
      house: "Panthalikudy House, Kuruppampady",
    },
    two: {
      name: "Vibin Paul",
      relation: "Son of",
      parents: "Mr. Paul Pottackal & Mrs. Kumary Paul",
      house: "Pottackal House, Mudakuzha",
    },
  },

  /** Stands in place of a "how they met" section. */
  verse: {
    eyebrow: "A Blessing",
    text: "I have found the one whom my soul loves.",
    reference: "Song of Solomon 3:4",
  },

  // TODO: swap in the real photograph at public/images/couple.jpg
  photo: {
    src: "/images/couple-placeholder.jpg",
    alt: "Jesme and Vibin",
  },

  /** Textural imagery only — deliberately no stock photographs of people. */
  atmosphere: {
    eyebrow: "The Evening",
    items: [
      { src: "/images/atmos-candles.jpg", alt: "Ivory candles in brass candlesticks", caption: "Candlelight" },
      { src: "/images/atmos-roses.jpg", alt: "Ivory roses and jasmine", caption: "Ivory & Jasmine" },
      { src: "/images/atmos-arch.jpg", alt: "A carved stone arch lit by a brass lamp", caption: "Under the Arches" },
      { src: "/images/atmos-velvet.jpg", alt: "Emerald velvet with gold embroidery", caption: "Emerald & Gold" },
    ],
  },

  // Set to a file in public/audio to enable the music toggle.
  audioSrc: null as string | null,

  rsvp: {
    eyebrow: "RSVP",
    title: "Will you join us?",
    note: "Kindly let us know by 19 October so we can plan the evening.",
    deadlineIso: "2026-10-19T23:59:00+05:30",
  },

  contact: {
    name: "Eldho",
    phone: "+919447063583",
    display: "+91 94470 63583",
  },

  wishes: {
    eyebrow: "Wishes",
    title: "Leave them a blessing",
    note: "A line from you, kept for Jesme and Vibin to read.",
  },

  footer: {
    credit: "With wishes from Jeswin Eldho",
  },

  meta: {
    title: "Jesme & Vibin — Engagement",
    description:
      "Together with our families, we invite you to celebrate our engagement on 26 October 2026 at Seema Auditorium, Perumbavoor.",
  },
} as const;

export type Invitation = typeof invitation;
