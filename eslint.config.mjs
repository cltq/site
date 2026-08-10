import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-extra-semi": "off",
      "no-empty": ["error", { allowEmptyCatch: true }],
      "prefer-const": "off",
    },
  },
  globalIgnores(["dist/**", "node_modules/**", ".astro/**", "public/**"]),
]);
