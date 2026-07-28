import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function loadFont(name: string) {
  return fs.readFileSync(
    path.join(process.cwd(), "node_modules/geist/dist/fonts/geist-mono", name),
  );
}

const geistRegular = loadFont("GeistMono-Regular.ttf");
const geistBold = loadFont("GeistMono-Bold.ttf");

export default async function ImageResponseGen() {
  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          background: "#000000",
          fontFamily: '"Geist Mono"',
          position: "relative",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {/* Radial glow blobs */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -80,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(120,80,255,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            right: -60,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(80,140,255,0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 100,
            right: 200,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Dot grid pattern */}
        <svg
          width={size.width}
          height={size.height}
          style={{ position: "absolute", top: 0, left: 0, opacity: 0.15 }}
        >
          {Array.from({ length: Math.ceil(size.height / 32) }).map((_, row) =>
            Array.from({ length: Math.ceil(size.width / 32) }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={col * 32 + 16}
                cy={row * 32 + 16}
                r={1}
                fill="white"
              />
            )),
          )}
        </svg>

        {/* Subtle top gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 200,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)",
          }}
        />

        {/* Main content container */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "72px 80px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left side — text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              flex: 1,
            }}
          >
            {/* Name */}
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: "#fafafa",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Maple
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: 20,
                color: "#a3a3a3",
                lineHeight: 1.4,
                letterSpacing: "-0.01em",
              }}
            >
              Portfolio &amp; Personal Website
            </div>

            {/* Divider */}
            <div
              style={{
                width: 48,
                height: 2,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)",
                borderRadius: 1,
                marginTop: 4,
                marginBottom: 4,
              }}
            />

            {/* Role badges */}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              {["Developer", "Photographer", "Normal Person"].map((role) => (
                <div
                  key={role}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                    fontSize: 13,
                    color: "#a3a3a3",
                    letterSpacing: "0.02em",
                  }}
                >
                  {role}
                </div>
              ))}
            </div>

            {/* URL */}
            <div
              style={{
                fontSize: 14,
                color: "#525252",
                marginTop: 12,
                letterSpacing: "0.01em",
              }}
            >
              applefumi.xyz
            </div>
          </div>

          {/* Right side — decorative */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              marginLeft: 60,
            }}
          >
            {/* Avatar circle */}
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                border: "1.5px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 40px rgba(120,80,255,0.08)",
              }}
            >
              {/* M letter */}
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  color: "#fafafa",
                  opacity: 0.9,
                  letterSpacing: "-0.02em",
                }}
              >
                M
              </div>
            </div>

            {/* Glass panel with stats */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: "20px 24px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                minWidth: 200,
              }}
            >
              {/* GitHub icon + link */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 14,
                  color: "#a3a3a3",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a3a3a3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                <span>github.com/cltq</span>
              </div>

              {/* Divider */}
              <div
                style={{
                  width: "100%",
                  height: 1,
                  background: "rgba(255,255,255,0.06)",
                }}
              />

              {/* Discord icon */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 14,
                  color: "#a3a3a3",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="#a3a3a3"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span>discord</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom border glow */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(120,80,255,0.1) 50%, rgba(255,255,255,0.06) 70%, transparent 100%)",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist Mono",
          data: geistRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Geist Mono",
          data: geistBold,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}