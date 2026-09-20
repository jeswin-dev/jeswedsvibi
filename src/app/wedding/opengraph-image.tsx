import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { invitation, occasions } from "@/content/invitation";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = invitation.meta.weddingTitle;

const { couple } = invitation;
const { date, venue } = occasions.wedding;

export default async function OpengraphImage() {
  const cormorant = await readFile(
    path.join(process.cwd(), "src/assets/cormorant-light.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e2a23",
          fontFamily: "Cormorant",
          color: "#f7f3ea",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(70% 55% at 50% 10%, rgba(27,77,62,0.75), rgba(14,42,35,0))",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "2px solid rgba(201,162,39,0.45)",
          }}
        />

        <div
          style={{
            fontSize: 22,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "rgba(201,162,39,0.85)",
          }}
        >
          The Wedding
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 26 }}>
          <span style={{ fontSize: 104 }}>{couple.one.first}</span>
          <span style={{ fontSize: 52, color: "#e3c978" }}>&</span>
          <span style={{ fontSize: 104 }}>{couple.two.first}</span>
        </div>

        <div
          style={{
            width: 220,
            height: 1,
            marginTop: 30,
            background: "rgba(201,162,39,0.6)",
          }}
        />

        <div
          style={{
            marginTop: 30,
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(247,243,234,0.8)",
          }}
        >
          {date.display}
        </div>
        <div style={{ marginTop: 14, fontSize: 30, color: "#b08d57" }}>
          {`${venue.name}, ${venue.area}`}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Cormorant", data: cormorant, weight: 300, style: "normal" }],
    },
  );
}
