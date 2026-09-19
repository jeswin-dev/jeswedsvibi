import { z } from "zod";

/** Shared by the form and the route handler, so both agree on what is valid. */
export const rsvpSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a phone number")
    .max(20)
    .regex(/^[+\d][\d\s\-()]*$/, "Digits only, please"),
  attending: z.enum(["yes", "no"]),
  guests: z.coerce.number().int().min(0).max(12),
  // Bots fill hidden fields; people do not.
  honeypot: z.string().max(0).optional(),
});

export const wishSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(60),
  message: z.string().trim().min(3, "Please write a line or two").max(280),
  honeypot: z.string().max(0).optional(),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;
export type WishInput = z.infer<typeof wishSchema>;

export type Wish = {
  name: string;
  message: string;
  at: string;
};
