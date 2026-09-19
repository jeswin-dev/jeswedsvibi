"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

const control =
  "min-h-12 w-full border border-champagne/35 bg-ivory-lift/60 px-4 py-3 font-display text-lg text-forest transition-colors duration-300 [font-variant-numeric:lining-nums] placeholder:text-forest/35 focus:border-champagne focus:outline-none";

type FieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

export function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="block text-left">
      <span className="label text-champagne">{label}</span>
      <span className="mt-2 block">{children}</span>
      {hint ? <span className="mt-2 block text-xs text-forest/55">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: ComponentPropsWithoutRef<"input">) {
  return <input className={control} {...props} />;
}

export function TextArea(props: ComponentPropsWithoutRef<"textarea">) {
  return <textarea className={`${control} resize-none leading-relaxed`} {...props} />;
}

export function Select(props: ComponentPropsWithoutRef<"select">) {
  return <select className={`${control} appearance-none`} {...props} />;
}

/** Bots fill hidden inputs; people never see this one. */
export function Honeypot({ name }: { name: string }) {
  return (
    <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden>
      <input name={name} tabIndex={-1} autoComplete="off" />
    </div>
  );
}
