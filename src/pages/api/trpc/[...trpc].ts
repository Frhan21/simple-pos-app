import { createNextApiHandler } from "@trpc/server/adapters/next";

import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  // Always log: production 500s still need a trace in Vercel Runtime Logs.
  onError: ({ path, error }) => {
    console.error(
      `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.code} ${error.message}`,
      JSON.stringify(error.cause ? String(error.cause) : undefined),
    );
  },
});
