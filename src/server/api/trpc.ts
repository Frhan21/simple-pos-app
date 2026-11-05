import { db } from "@/server/db";
import { syncClerkUser } from "@/server/users/sync-clerk-user";
import { Prisma } from "@/generated/prisma/client";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";

interface CreateContextOptions {
  session: ReturnType<typeof getAuth>;
}

// Test-only helper: build a context without a Next.js request.
export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req } = opts;

  const session = getAuth(req);

  return createInnerTRPCContext({
    session,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const clerkUserId = ctx.session.userId;

  if (!clerkUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Fallback provisioning: create local user if Clerk webhook hasn't landed yet.
  let user = await db.user.findUnique({ where: { id: clerkUserId } });

  if (user?.deletedAt) {
    // Soft-deleted (removed in Clerk): deny access, never resurrect.
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (!user) {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(clerkUserId);
    user = await syncClerkUser({
      id: clerkUser.id,
      email:
        clerkUser.emailAddresses.find(
          (e) => e.id === clerkUser.primaryEmailAddressId,
        )?.emailAddress ?? null,
      name:
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
        null,
      imageUrl: clerkUser.imageUrl || null,
    });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session },
      currentUser: user,
    },
  });
});

export const publicProcedure = t.procedure;

// Cross-tenant record-not-found must surface as NOT_FOUND, not an internal P2025 error.
export const isRecordNotFound = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === "P2025";

export const mapRecordNotFound = (error: unknown) => {
  if (isRecordNotFound(error)) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Resource not found",
    });
  }
  throw error;
};
