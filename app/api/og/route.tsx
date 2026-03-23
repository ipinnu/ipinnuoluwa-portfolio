import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Ipinnuoluwa Oladipo";
  const subtitle = searchParams.get("subtitle") || "Flutter & Product Engineer · Lagos";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0A0A0A",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: brand */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontSize: "28px",
              fontWeight: "800",
              color: "#E8FF47",
              letterSpacing: "-0.5px",
            }}
          >
            ip.
          </span>
        </div>

        {/* Middle: title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p
            style={{
              fontSize: "14px",
              color: "#444440",
              fontFamily: "monospace",
              letterSpacing: "2px",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {subtitle}
          </p>
          <h1
            style={{
              fontSize: title.length > 40 ? "48px" : "64px",
              fontWeight: "800",
              color: "#F5F5F0",
              lineHeight: "1.1",
              margin: 0,
              maxWidth: "900px",
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom: accent bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "3px",
              backgroundColor: "#E8FF47",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              color: "#888884",
              fontFamily: "monospace",
            }}
          >
            ipinnuoluwa.dev
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
