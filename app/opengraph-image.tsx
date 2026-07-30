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
    <div
      style={{
        width: size.width,
        height: size.height,
        background: "#000000",
        fontFamily: '"Geist Mono"',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "72px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <span style={{ fontSize: 72, fontWeight: 700, color: "#fafafa", lineHeight: 1 }}>
          Maple
        </span>
        <span style={{ fontSize: 20, color: "#a3a3a3", lineHeight: 1.4 }}>
          Portfolio &amp; Personal Website
        </span>
      </div>
    </div>,
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
