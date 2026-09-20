import { Countdown } from "@/components/sections/Countdown";
import { EveningBand } from "@/components/sections/EveningBand";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Invitation } from "@/components/sections/Invitation";
import { Venue } from "@/components/sections/Venue";
import { Verse } from "@/components/sections/Verse";
import { Wishes } from "@/components/sections/Wishes";
import { ArchDivider, Section } from "@/components/ui/Section";

// Parked, not deleted — one line away from returning:
// import { Rsvp } from "@/components/sections/Rsvp";

export default function Page() {
  return (
    <main>
      <Hero />

      <ArchDivider from="emerald" to="ivory" />

      <Section tone="ivory" framed id="invitation">
        <Invitation />
      </Section>

      <ArchDivider from="ivory" to="emerald" />

      <Section id="countdown" framed>
        <Countdown />
      </Section>

      <ArchDivider from="emerald" to="ivory" />

      <Section tone="ivory" compact framed>
        <Verse />
      </Section>

      <ArchDivider from="ivory" to="emerald" />

      <EveningBand />

      <Section id="venue">
        <Venue />
      </Section>

      <ArchDivider from="emerald" to="ivory" />

      <Section tone="ivory" framed id="wishes">
        <Wishes />
      </Section>

      <ArchDivider from="ivory" to="emerald" />

      <Section compact>
        <Footer />
      </Section>
    </main>
  );
}
