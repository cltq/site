import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

// @ts-check
export default defineConfig({
  site: "https://applefumi.xyz",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  integrations: [react()],
  redirects: {
    "/biolinks": { destination: "/bio", status: 308 },
    "/projects": { destination: "/project", status: 308 },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
