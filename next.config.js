/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  // i18n omitted on purpose: Pages Router i18n breaks dynamic API routes on
  // Vercel (vercel/next.js#96935) and this app ships a single locale.
};

export default config;
