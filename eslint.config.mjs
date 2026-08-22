import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Pre-existing data-fetching patterns ported from the Astro version
      "react-hooks/set-state-in-effect": "off",
    },
  },
  globalIgnores([".next/", "node_modules/", "next-env.d.ts", ".turbo/"]),
]);

export default eslintConfig;
