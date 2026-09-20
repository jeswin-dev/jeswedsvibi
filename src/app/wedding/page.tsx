import type { Metadata } from "next";

import { InvitationHome } from "@/components/InvitationHome";
import { invitation } from "@/content/invitation";

export const metadata: Metadata = {
  title: invitation.meta.weddingTitle,
  description: invitation.meta.weddingDescription,
  appleWebApp: {
    capable: true,
    title: invitation.meta.weddingTitle,
    statusBarStyle: "black-translucent",
  },
};

export default function WeddingPage() {
  return <InvitationHome edition="wedding" />;
}
