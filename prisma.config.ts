import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Prisma 7 no longer reads DB URLs from the schema; CLI commands read it here.
    // Use DIRECT_URL if available (session mode for migrations/push), otherwise fallback to DATABASE_URL.
    // PRISMA_DB_URL override wins (used by tests to target simple-pos-test).
    url:
      process.env.PRISMA_DB_URL ??
      process.env.DIRECT_URL ??
      process.env.DATABASE_URL ??
      "",
    ...(process.env.SHADOW_DATABASE_URL
      ? { shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL }
      : process.env.PRISMA_SHADOW_DB_URL
        ? { shadowDatabaseUrl: process.env.PRISMA_SHADOW_DB_URL }
        : {}),
  },
});
