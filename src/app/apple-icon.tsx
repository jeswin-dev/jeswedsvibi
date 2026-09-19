import { ImageResponse } from "next/og";

import { invitation } from "@/content/invitation";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for iOS, which needs a raster image rather than the SVG. */
export default function AppleIcon() {
  const initials = `${invitation.couple.one.initial} ${invitation.couple.two.initial}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e2a23",
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: "50%",
            border: "1px solid rgba(201,162,39,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#e3c978",
            fontSize: 54,
            letterSpacing: 2,
          }}
        >
          {initials}
        </div>
      </div>
    ),
    size,
  );
}
