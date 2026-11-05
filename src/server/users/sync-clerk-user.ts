import { db } from "@/server/db";

// Single source of truth for syncing Clerk users into the local `users` table.
// `id` is the Clerk user ID. Never store auth secrets here.
export const syncClerkUser = async (input: {
  id: string;
  email?: string | null;
  name?: string | null;
  imageUrl?: string | null;
}) => {
  return db.user.upsert({
    where: { id: input.id },
    create: {
      id: input.id,
      email: input.email ?? null,
      name: input.name ?? null,
      imageUrl: input.imageUrl ?? null,
      deletedAt: null,
    },
    update: {
      email: input.email ?? null,
      name: input.name ?? null,
      imageUrl: input.imageUrl ?? null,
      deletedAt: null,
    },
  });
};

export const softDeleteClerkUser = async (id: string) => {
  // Soft delete only: business records stay for audit.
  await db.user.updateMany({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() },
  });
};
