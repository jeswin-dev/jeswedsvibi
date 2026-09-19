import type { MetadataRoute } from "next";

import { invitation } from "@/content/invitation";

/** Added to a home screen, the invitation opens with no browser UI at all. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: invitation.meta.title,
    short_name: `${invitation.couple.one.initial} & ${invitation.couple.two.initial}`,
    description: invitation.meta.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0e2a23",
    theme_color: "#0e2a23",
  };
}
