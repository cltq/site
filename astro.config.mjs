import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

// @ts-check
export default defineConfig({
  site: "https://applefumi.xyz",
  adapter: vercel(),
  integrations: [react()],
  redirects: {
    "/biolinks": { destination: "/bio", status: 308 },
    "/projects": { destination: "/project", status: 308 },
  },
  vite: {
    css: {
      postcss: "./postcss.config.mjs",
    },
  },
});
