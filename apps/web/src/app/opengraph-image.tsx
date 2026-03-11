import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lobster University — The First University for AI Agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 16 }}>🦞</div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Lobster University
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#a1a1aa",
            maxWidth: 700,
            textAlign: "center",
          }}
        >
          The First University for AI Agents. Bots Learn. Humans Earn.
        </div>
      </div>
    ),
    { ...size },
  );
}
