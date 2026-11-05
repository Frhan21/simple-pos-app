import { createInnerTRPCContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";

// Mimic `getAuth(req)` output; protectedProcedure only reads `session.userId`.
const authFor = (userId: string | null) =>
  ({
    userId,
    sessionId: userId ? `sess_${userId}` : null,
    isAuthenticated: !!userId,
  }) as never;

export const callerAs = (userId: string | null) =>
  appRouter.createCaller(
    createInnerTRPCContext({
      session: authFor(userId),
    }),
  );
