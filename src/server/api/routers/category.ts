import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  mapRecordNotFound,
} from "../trpc";

export const categoryRouter = createTRPCRouter({
  getCategories: protectedProcedure.query(async ({ ctx }) => {
    const { db, currentUser } = ctx;

    const categories = await db.category.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
    return categories;
  }),

  createCategory: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(3, "Name must be at least 3 characters")
          .max(255, "Name must be at most 255 characters"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, currentUser } = ctx;
      const newCategory = await db.category.create({
        data: {
          name: input.name,
          userId: currentUser.id,
        },
        select: {
          id: true,
          name: true,
        },
      });

      return newCategory;
    }),

  deleteCategory: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, currentUser } = ctx;
      // Ownership check in where clause: cross-tenant id yields NOT_FOUND.
      await db.category
        .delete({
          where: {
            id: input.id,
            userId: currentUser.id,
          },
        })
        .catch(mapRecordNotFound);
    }),

  editCategory: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z
          .string()
          .min(3, "Name must be at least 3 characters")
          .max(255, "Name must be at most 255 characters"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, currentUser } = ctx;
      await db.category
        .update({
          where: {
            id: input.id,
            userId: currentUser.id,
          },
          data: {
            name: input.name,
          },
        })
        .catch(mapRecordNotFound);
    }),
});
