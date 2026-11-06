import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// Regression guard: tRPC must be a catch-all API route, otherwise a single
// dynamic segment can fall through to the localized 404 on some deployments.
describe("tRPC API route", () => {
  it("uses a catch-all handler at /api/trpc/[...trpc]", () => {
    const catchAll = join(
      process.cwd(),
      "src/pages/api/trpc/[...trpc].ts",
    );
    const single = join(process.cwd(), "src/pages/api/trpc/[trpc].ts");
    expect(existsSync(catchAll)).toBe(true);
    expect(existsSync(single)).toBe(false);
    expect(readFileSync(catchAll, "utf8")).toContain("createNextApiHandler");
  });
});
