import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Prisma 7 no longer reads DB URLs from the schema; CLI commands read it here.
    // Empty string keeps `prisma generate` (postinstall) working without a DB.
    url: process.env.DATABASE_URL ?? "",
  },
});
