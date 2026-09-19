import { invitation } from "@/content/invitation";

const DURATION_HOURS = 4;

function toCalendarStamp(date: Date) {
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

function window_() {
  const start = new Date(invitation.date.iso);
  const end = new Date(start.getTime() + DURATION_HOURS * 3600 * 1000);
  return { start: toCalendarStamp(start), end: toCalendarStamp(end) };
}

const title = `${invitation.couple.one.first} & ${invitation.couple.two.first} — Engagement`;
const location = [invitation.venue.name, ...invitation.venue.addressLines].join(", ");

export function googleCalendarUrl() {
  const { start, end } = window_();

  return `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details: invitation.meta.description,
    location,
  })}`;
}

/** A data URL, so "add to calendar" needs no server round trip. */
export function icsDataUrl() {
  const { start, end } = window_();

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Engagement Invitation//EN",
    "BEGIN:VEVENT",
    `UID:${start}-engagement@invitation`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${invitation.meta.description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  // Calendar files need CRLF line endings to be read reliably.
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}
