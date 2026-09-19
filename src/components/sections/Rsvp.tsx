"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Field, Honeypot, Select, TextInput } from "@/components/ui/Field";
import { GoldRule } from "@/components/ui/GoldRule";
import { Monogram } from "@/components/ui/Monogram";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { invitation } from "@/content/invitation";
import { ease } from "@/lib/motion";
import { rsvpSchema } from "@/lib/schemas";

const { contact, couple, rsvp } = invitation;

type Status = "idle" | "sending" | "sent" | "error";

const whatsappFallback = `https://wa.me/${contact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
  `Hello! Regarding ${couple.one.first} & ${couple.two.first}'s engagement — I'd like to RSVP.`,
)}`;

export function Rsvp() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [attending, setAttending] = useState("yes");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const parsed = rsvpSchema.safeParse({
      name: form.get("name"),
      phone: form.get("phone"),
      attending: form.get("attending"),
      guests: form.get("guests") ?? 0,
      honeypot: form.get("company") ?? "",
    });

    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }

    setStatus("sending");
    setMessage(null);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
        setMessage(
          body.error === "not-configured"
            ? "Our form is not quite ready. Please message us instead — we'll note you down."
            : (body.error ?? "Something went wrong. Please try again."),
        );
        return;
      }

      setStatus("sent");
    } catch {
      setStatus("error");
      setMessage("No connection. Please try again, or message us.");
    }
  }

  return (
    <>
      <SectionHeading eyebrow={rsvp.eyebrow} title={rsvp.title} tone="ivory" />

      <div className="relative mx-auto mt-12 w-full max-w-md md:mt-14">
        <AnimatePresence mode="wait">
          {status === "sent" ? (
            <motion.div
              key="sent"
              className="flex flex-col items-center py-6 text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
            >
              <Monogram
                initials={[couple.one.initial, couple.two.initial]}
                className="size-28 [--color-gold-light:var(--color-champagne)]"
              />
              <p className="mt-6 font-display text-2xl leading-snug font-light text-forest italic">
                Thank you — your reply is with us.
              </p>
              <GoldRule ornament className="mt-6 w-24" />
              <p className="mt-6 text-sm text-forest/65">
                We cannot wait to celebrate with you.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              className="relative flex flex-col gap-5"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease }}
              noValidate
            >
              <Honeypot name="company" />

              <Field label="Your name">
                <TextInput name="name" autoComplete="name" required placeholder="Full name" />
              </Field>

              <Field label="Phone">
                <TextInput
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  placeholder="+91"
                />
              </Field>

              <Field label="Will you be there?">
                <Select
                  name="attending"
                  value={attending}
                  onChange={(event) => setAttending(event.target.value)}
                >
                  <option value="yes">Joyfully accepts</option>
                  <option value="no">Regretfully declines</option>
                </Select>
              </Field>

              {attending === "yes" ? (
                <Field label="How many of you?" hint="Including yourself.">
                  <Select name="guests" defaultValue="1">
                    {Array.from({ length: 8 }, (_, index) => index + 1).map((count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    ))}
                  </Select>
                </Field>
              ) : (
                <input type="hidden" name="guests" value="0" />
              )}

              <Button
                type="submit"
                tone="outlineDark"
                disabled={status === "sending"}
                className="mt-2 w-full border-champagne/60 bg-forest text-ivory hover:bg-forest/90"
              >
                {status === "sending" ? "Sending…" : "Send our reply"}
              </Button>

              {message ? (
                <p role="alert" className="text-center text-sm text-forest/75">
                  {message}
                </p>
              ) : null}
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <Reveal delay={0.2}>
        <div className="mt-12 text-center">
          <p className="text-sm text-forest/65">{rsvp.note}</p>
          <p className="mt-5 text-sm text-forest/70">
            Prefer to call? {contact.name} on{" "}
            <a
              href={`tel:${contact.phone}`}
              className="border-b border-champagne/50 pb-0.5 whitespace-nowrap text-forest transition-colors hover:border-champagne"
            >
              {contact.display}
            </a>
            {" · "}
            <a
              href={whatsappFallback}
              target="_blank"
              rel="noreferrer noopener"
              className="border-b border-champagne/50 pb-0.5 text-forest transition-colors hover:border-champagne"
            >
              WhatsApp
            </a>
          </p>
        </div>
      </Reveal>
    </>
  );
}
