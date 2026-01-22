import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  getCategories: protectedProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    const categories = await db.category.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        productCount: true,
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
      const { db } = ctx;
      const newCategory = await db.category.create({
        data: {
          name: input.name,
          createdBy: ctx.session.userId,
        },
        select: {
          id: true,
          name: true,
          productCount: true,
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
      const { db } = ctx;
      await db.category.delete({
        where: {
          id: input.id,
        },
      });
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
      const { db } = ctx;
      await db.category.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
});
