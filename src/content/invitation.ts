/**
 * Every piece of copy and every detail on the site lives here.
 * Anything marked TODO is a placeholder waiting on real details.
 */

const engagementDate = {
  iso: "2026-10-26T18:30:00+05:30",
  timeZone: "Asia/Kolkata",
  display: "26 October 2026",
  dayOfWeek: "Monday",
  time: "6:30 in the evening onwards",
  timeShort: "6:30 PM onwards",
} as const;

const engagementVenue = {
  name: "Seema Auditorium",
  area: "Perumbavoor",
  city: "Ernakulam, Kerala",
  addressLines: [
    "Seema Auditorium Road, Pathipalam",
    "Perumbavoor, Ernakulam",
    "Kerala 683542",
  ],
  // Resolved from the shared Google Maps pin, so directions land exactly right.
  coords: { lat: 10.1094907, lng: 76.4767437 },
  mapQuery: "Seema Auditorium, Perumbavoor, Ernakulam, Kerala",
} as const;

const madhuramveppDate = {
  iso: "2026-10-30T19:00:00+05:30",
  timeZone: "Asia/Kolkata",
  display: "30 October 2026",
  dayOfWeek: "Friday",
  time: "7:00 in the evening onwards",
  timeShort: "7:00 PM onwards",
} as const;

const madhuramveppVenue = {
  name: "River Front Resort",
  area: "Kodanad",
  city: "Ernakulam, Kerala",
  addressLines: ["Forest IB Road, Kodanad", "Perumbavoor, Ernakulam", "Kerala 683544"],
  // Place pin from the shared Google Maps link.
  coords: { lat: 10.181378, lng: 76.5051842 },
  mapQuery: "River Front Resort, Kodanad, Perumbavoor",
} as const;

const weddingDate = {
  iso: "2026-11-01T14:00:00+05:30",
  timeZone: "Asia/Kolkata",
  display: "1 November 2026",
  dayOfWeek: "Sunday",
  time: "2:00 in the afternoon",
  timeShort: "2:00 PM",
} as const;

const weddingVenue = {
  name: "St George Jacobite Syrian Church",
  area: "Chudakuzhy",
  city: "Ernakulam, Kerala",
  addressLines: [
    "St George Jacobite Syrian Church",
    "Chudakuzhy, Vengoor West",
    "Kerala 683546",
  ],
  coords: { lat: 10.1587877, lng: 76.5208514 },
  mapQuery: "St. George Jacobite Syrian Church, Chundakuzhy",
} as const;

const receptionDate = {
  iso: "2026-11-01T18:00:00+05:30",
  timeZone: "Asia/Kolkata",
  display: "1 November 2026",
  dayOfWeek: "Sunday",
  time: "6:00 in the evening onwards",
  timeShort: "6:00 PM onwards",
} as const;

const receptionVenue = {
  name: "St Mary's Church",
  area: "Alattuchira",
  city: "Ernakulam, Kerala",
  addressLines: ["St Mary's Church", "Alattuchira, Perumbavoor", "Kerala 683544"],
  coords: { lat: 10.1819, lng: 76.5431 },
  mapQuery: "St Mary's Church, Alattuchira, Perumbavoor",
} as const;

export const occasions = {
  engagement: {
    key: "engagement",
    label: "The Engagement",
    date: engagementDate,
    venue: engagementVenue,
  },
  madhuramvepp: {
    key: "madhuramvepp",
    label: "Madhuramvepp",
    date: madhuramveppDate,
    venue: madhuramveppVenue,
  },
  wedding: {
    key: "wedding",
    label: "The Wedding Ceremony",
    date: weddingDate,
    venue: weddingVenue,
  },
  reception: {
    key: "reception",
    label: "The Reception",
    date: receptionDate,
    venue: receptionVenue,
  },
} as const;

export const programme = [
  occasions.engagement,
  occasions.madhuramvepp,
  occasions.wedding,
  occasions.reception,
] as const;

export type Occasion = (typeof programme)[number];
export type Edition = "engagement" | "wedding";

export function primaryOccasion(edition: Edition): Occasion {
  return edition === "wedding" ? occasions.wedding : occasions.engagement;
}

export const invitation = {
  couple: {
    // `first` is what the hero shows; `full` is for the formal wording.
    one: { first: "Jesme", full: "Dr Jesme Eldho", initial: "J" },
    two: { first: "Vibin", full: "Vibin Kurian Paul", initial: "V" },
  },

  // The home page is the engagement; `/wedding` adds Madhuramvepp and the wedding.
  date: engagementDate,
  venue: engagementVenue,
  occasions,
  programme,

  hero: {
    eyebrow: "Together with our families",
    connector: "and",
    scrollCue: "Scroll",
  },

  /** The formal invitation wording, one block per family. */
  invite: {
    eyebrow: "The Engagement",
    lead: "With joyful hearts and the blessings of our families, we invite you and your family to the engagement of",
    weddingEyebrow: "The Wedding",
    weddingLead:
      "With joyful hearts and the blessings of our families, we invite you and your family to the wedding of",
    closing: "Your presence and prayers would mean the world to us.",
  },

  families: {
    one: {
      name: "Dr Jesme Eldho",
      relation: "Daughter of",
      parents: "Dr. Eldho P. Varghese & Mrs. Meena Eldho",
      house: "Panthalikudy House, Kuruppampady",
    },
    two: {
      name: "Vibin Kurian Paul",
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

  photo: {
    src: "/images/jesme-vibin.jpg",
    alt: "Jesme and Vibin",
  },

  // A short looping excerpt of Gymnopédie No. 1 (Kevin MacLeod, CC BY 3.0).
  audioSrc: "/audio/gymnopedie-loop.m4a",

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
    music: "Gymnopédie No. 1 — Kevin MacLeod",
  },

  meta: {
    title: "Jesme & Vibin — Engagement",
    description:
      "Together with our families, we invite you and your family to celebrate our engagement on 26 October 2026 at Seema Auditorium, Perumbavoor.",
    weddingTitle: "Jesme & Vibin — Wedding",
    weddingDescription:
      "Together with our families, we invite you and your family to the engagement on 26 October, Madhuramvepp on 30 October, and the wedding ceremony on 1 November 2026 at St George Jacobite Syrian Church, Chudakuzhy, followed by the reception at St Mary's Church, Alattuchira.",
  },
} as const;

export type Invitation = typeof invitation;
