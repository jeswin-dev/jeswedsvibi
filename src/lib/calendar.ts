import type { Occasion } from "@/content/invitation";
import { invitation, primaryOccasion, type Edition } from "@/content/invitation";

const DURATION_HOURS = 4;

function toCalendarStamp(date: Date) {
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

function windowFor(occasion: Occasion) {
  const start = new Date(occasion.date.iso);
  const end = new Date(start.getTime() + DURATION_HOURS * 3600 * 1000);
  return { start: toCalendarStamp(start), end: toCalendarStamp(end) };
}

function titleFor(occasion: Occasion) {
  return `${invitation.couple.one.first} & ${invitation.couple.two.first} — ${occasion.label}`;
}

function locationFor(occasion: Occasion) {
  return [occasion.venue.name, ...occasion.venue.addressLines].join(", ");
}

export function googleCalendarUrl(occasion: Occasion) {
  const { start, end } = windowFor(occasion);

  return `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: titleFor(occasion),
    dates: `${start}/${end}`,
    details: invitation.meta.description,
    location: locationFor(occasion),
  })}`;
}

/** A data URL, so "add to calendar" needs no server round trip. */
export function icsDataUrl(occasion: Occasion) {
  const { start, end } = windowFor(occasion);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Engagement Invitation//EN",
    "BEGIN:VEVENT",
    `UID:${start}-${occasion.key}@invitation`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${titleFor(occasion)}`,
    `LOCATION:${locationFor(occasion)}`,
    `DESCRIPTION:${invitation.meta.description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  // Calendar files need CRLF line endings to be read reliably.
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}

export function icsFileName(edition: Edition) {
  const occasion = primaryOccasion(edition);
  return `jesme-and-vibin-${occasion.key}.ics`;
}
