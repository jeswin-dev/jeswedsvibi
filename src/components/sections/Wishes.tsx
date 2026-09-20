"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Field, Honeypot, TextArea, TextInput } from "@/components/ui/Field";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { invitation } from "@/content/invitation";
import { ease } from "@/lib/motion";
import type { Wish } from "@/lib/schemas";
import { wishSchema } from "@/lib/schemas";

const { wishes } = invitation;

type Status = "idle" | "sending" | "sent" | "error";

export function Wishes() {
  const [list, setList] = useState<Wish[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/wishes")
      .then((response) => response.json())
      .then((body) => {
        if (!active) return;
        if (Array.isArray(body.wishes)) setList(body.wishes);
        setLoaded(true);
      })
      .catch(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const parsed = wishSchema.safeParse({
      name: data.get("name"),
      message: data.get("message"),
      honeypot: data.get("website") ?? "",
    });

    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }

    setStatus("sending");
    setMessage(null);

    try {
      const response = await fetch("/api/wishes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
        setMessage(
          body.error === "not-configured"
            ? "Wishes are not open just yet. Do try again a little later."
            : (body.error ?? "Something went wrong. Please try again."),
        );
        return;
      }

      // Publishes instantly, so show it at the top straight away.
      if (body.wish) setList((current) => [body.wish, ...current]);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("No connection. Please try again.");
    }
  }

  return (
    <>
      <SectionHeading eyebrow={wishes.eyebrow} title={wishes.title} tone="ivory" numeral="V" />

      <Reveal delay={0.15}>
        <p className="mx-auto mt-8 max-w-sm text-center text-sm leading-relaxed text-forest/65">
          {wishes.note}
        </p>
      </Reveal>

      <form onSubmit={onSubmit} className="relative mx-auto mt-10 w-full max-w-md" noValidate>
        <Honeypot name="website" />

        <div className="flex flex-col gap-4">
          <Field label="Your name">
            <TextInput name="name" autoComplete="name" required placeholder="Full name" />
          </Field>
          <Field label="Your wish">
            <TextArea
              name="message"
              rows={3}
              required
              maxLength={280}
              placeholder="A line for them…"
            />
          </Field>
        </div>

        <Button type="submit" tone="solidDark" disabled={status === "sending"} className="mt-5 w-full">
          {status === "sending" ? "Sending…" : "Leave your wish"}
        </Button>

        {message ? (
          <p role="alert" className="mt-4 text-center text-sm text-forest/75">
            {message}
          </p>
        ) : null}
        {status === "sent" && !message ? (
          <p className="mt-4 text-center font-display text-lg text-forest italic">
            Thank you — they will treasure that.
          </p>
        ) : null}
      </form>

      {list.length > 0 ? (
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-16 md:grid-cols-3">
          <AnimatePresence initial={false}>
            {list.map((wish, index) => (
              <motion.li
                key={`${wish.name}-${wish.at}-${index}`}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: Math.min(index * 0.05, 0.4) }}
                className="relative border border-champagne/30 bg-ivory-lift/80 p-5 shadow-[inset_0_0_0_1px_rgba(176,141,87,0.12)]"
              >
                <span
                  className="absolute -top-px -left-px size-2.5 border-t border-l border-champagne/80"
                  aria-hidden
                />
                <span
                  className="absolute -top-px -right-px size-2.5 border-t border-r border-champagne/80"
                  aria-hidden
                />
                <span
                  className="absolute -bottom-px -left-px size-2.5 border-b border-l border-champagne/80"
                  aria-hidden
                />
                <span
                  className="absolute -right-px -bottom-px size-2.5 border-b border-r border-champagne/80"
                  aria-hidden
                />
                <p className="font-display text-lg leading-snug text-forest/90 italic">
                  &ldquo;{wish.message}&rdquo;
                </p>
                <p className="label mt-4 text-[0.5625rem] text-champagne">— {wish.name}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : loaded ? (
        <p className="mt-14 text-center font-display text-lg text-forest/45 italic md:mt-16">
          No wishes yet — yours would be the first.
        </p>
      ) : null}
    </>
  );
}
