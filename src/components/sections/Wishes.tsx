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
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/wishes")
      .then((response) => response.json())
      .then((body) => {
        if (active && Array.isArray(body.wishes)) setList(body.wishes);
      })
      .catch(() => {});
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
      <SectionHeading eyebrow={wishes.eyebrow} title={wishes.title} />

      <Reveal delay={0.15}>
        <p className="mx-auto mt-8 max-w-sm text-center text-sm leading-relaxed text-ivory/65">
          {wishes.note}
        </p>
      </Reveal>

      <form onSubmit={onSubmit} className="mx-auto mt-10 w-full max-w-md" noValidate>
        <Honeypot name="website" />

        <div className="flex flex-col gap-4 [&_.label]:text-gold/70 [&_input]:border-gold/30 [&_input]:bg-emerald-mid/25 [&_input]:text-ivory [&_input]:placeholder:text-ivory/35 [&_textarea]:border-gold/30 [&_textarea]:bg-emerald-mid/25 [&_textarea]:text-ivory [&_textarea]:placeholder:text-ivory/35">
          <Field label="Your name">
            <TextInput name="name" autoComplete="name" required placeholder="Full name" />
          </Field>
          <Field label="Your wish">
            <TextArea name="message" rows={3} required maxLength={280} placeholder="A line for them…" />
          </Field>
        </div>

        <Button type="submit" disabled={status === "sending"} className="mt-5 w-full">
          {status === "sending" ? "Sending…" : "Leave your wish"}
        </Button>

        {message ? (
          <p role="alert" className="mt-4 text-center text-sm text-ivory/70">
            {message}
          </p>
        ) : null}
        {status === "sent" && !message ? (
          <p className="mt-4 text-center font-display text-lg text-gold-light italic">
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
                className="relative border border-gold/20 bg-emerald-mid/20 p-5"
              >
                <span
                  className="absolute -top-px -left-px size-2 border-t border-l border-gold/60"
                  aria-hidden
                />
                <p className="font-display text-lg leading-snug text-ivory/90 italic">
                  &ldquo;{wish.message}&rdquo;
                </p>
                <p className="label mt-4 text-[0.5625rem] text-champagne">— {wish.name}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : null}
    </>
  );
}
