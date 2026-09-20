import { Celebrations, Venue } from "@/components/sections/Venue";
import { Countdown } from "@/components/sections/Countdown";
import { EveningBand } from "@/components/sections/EveningBand";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Invitation } from "@/components/sections/Invitation";
import { Verse } from "@/components/sections/Verse";
import { Wishes } from "@/components/sections/Wishes";
import { ArchDivider, Section } from "@/components/ui/Section";
import type { Edition } from "@/content/invitation";

export function InvitationHome({ edition = "engagement" }: { edition?: Edition }) {
  const full = edition === "wedding";

  return (
    <main>
      <Hero edition={edition} />

      <ArchDivider from="emerald" to="ivory" />

      <Section tone="ivory" framed id="invitation">
        <Invitation edition={edition} />
      </Section>

      <ArchDivider from="ivory" to="emerald" />
      <Section id="venue">
        {full ? <Celebrations /> : <Venue />}
      </Section>
      
      <ArchDivider from="emerald" to="ivory" />

      <Section tone="ivory" compact framed>
        <Verse />
      </Section>

      <ArchDivider from="ivory" to="emerald" />

      <EveningBand />

      
      <Section id="countdown" framed>
        <Countdown edition={edition} />
      </Section>

      <ArchDivider from="emerald" to="ivory" />

      <Section tone="ivory" framed id="wishes">
        <Wishes />
      </Section>

      <ArchDivider from="ivory" to="emerald" />

      <Section compact>
        <Footer edition={edition} />
      </Section>
    </main>
  );
}
