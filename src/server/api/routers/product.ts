import { Bucket } from "@/server/bucket";
import { supabaseAdmin } from "@/server/supabase-admin";
import type { Prisma } from "@/generated/prisma/client";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  mapRecordNotFound,
} from "../trpc";

export const productRouter = createTRPCRouter({
  getProducts: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, currentUser } = ctx;

      const whereClause: Prisma.ProductWhereInput = {
        userId: currentUser.id,
      };

      if (input.categoryId != "all") {
        whereClause.categoryId = input.categoryId;
      }

      const product = await db.product.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return product;
    }),
  getAllProducts: protectedProcedure.query(async ({ ctx }) => {
    const { db, currentUser } = ctx;

    const product = await db.product.findMany({
      where: { userId: currentUser.id },
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return product;
  }),

  createProduct: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3),
        price: z.number().min(1000),
        categoryId: z.string(),
        imageUrl: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, currentUser } = ctx;

      // Category must belong to the same user.
      const category = await db.category.findFirst({
        where: { id: input.categoryId, userId: currentUser.id },
        select: { id: true },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      const newProduct = await db.product.create({
        data: {
          name: input.name,
          price: input.price,
          category: {
            connect: {
              id: input.categoryId,
            },
          },
          user: {
            connect: { id: currentUser.id },
          },
          imageUrl: input.imageUrl,
        },
      });

      return newProduct;
    }),

  createProductImageSignedUrl: protectedProcedure.mutation(async ({ ctx }) => {
    const { data, error } = await supabaseAdmin.storage
      .from(Bucket.ProductImages)
      .createSignedUploadUrl(`${ctx.currentUser.id}/${randomUUID()}.jpeg`);

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }

    return data;
  }),

  deleteProduct: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, currentUser } = ctx;
      await db.product
        .delete({
          where: {
            id: input.id,
            userId: currentUser.id,
          },
        })
        .catch(mapRecordNotFound);
    }),

  editProduct: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(3),
        price: z.number().min(1000),
        categoryId: z.string(),
        imageUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, currentUser } = ctx;

      // Target category must belong to the same user.
      const category = await db.category.findFirst({
        where: { id: input.categoryId, userId: currentUser.id },
        select: { id: true },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      await db.product
        .update({
          where: {
            id: input.id,
            userId: currentUser.id,
          },
          data: {
            name: input.name,
            price: input.price,
            category: {
              connect: {
                id: input.categoryId,
              },
            },
            ...(input.imageUrl ? { imageUrl: input.imageUrl } : {}),
          },
        })
        .catch(mapRecordNotFound);
    }),
});
