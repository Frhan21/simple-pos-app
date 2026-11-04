import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Prisma 7 no longer reads DB URLs from the schema; CLI commands read it here.
    // Use DIRECT_URL if available (session mode for migrations/push), otherwise fallback to DATABASE_URL.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
