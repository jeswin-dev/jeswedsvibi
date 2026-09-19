import { Atmosphere } from "@/components/sections/Atmosphere";
import { Countdown } from "@/components/sections/Countdown";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Invitation } from "@/components/sections/Invitation";
import { Rsvp } from "@/components/sections/Rsvp";
import { Venue } from "@/components/sections/Venue";
import { Verse } from "@/components/sections/Verse";
import { Wishes } from "@/components/sections/Wishes";
import { ArchDivider, Section } from "@/components/ui/Section";

export default function Page() {
  return (
    <main>
      <Hero />

      <ArchDivider from="emerald" to="ivory" />

      <Section tone="ivory" framed id="invitation">
        <Invitation />
      </Section>

      <ArchDivider from="ivory" to="emerald" />

      <Section id="countdown">
        <Countdown />
      </Section>

      <ArchDivider from="emerald" to="ivory" />

      <Section tone="ivory" compact>
        <Verse />
      </Section>

      <ArchDivider from="ivory" to="emerald" />

      <Atmosphere />

      <Section id="venue">
        <Venue />
      </Section>

      <ArchDivider from="emerald" to="ivory" />

      <Section tone="ivory" framed id="rsvp">
        <Rsvp />
      </Section>

      <ArchDivider from="ivory" to="emerald" />

      <Section id="wishes">
        <Wishes />
      </Section>

      <Section compact className="border-t border-gold/10">
        <Footer />
      </Section>
    </main>
  );
}
