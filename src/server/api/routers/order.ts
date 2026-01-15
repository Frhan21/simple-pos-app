import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  createQRIS,
  xenditPaymentClient,
  xenditPaymentRequestClient,
} from "@/server/xendit";
import { TRPCError } from "@trpc/server";
import { check } from "prettier";

export const orderRouter = createTRPCRouter({
  createOrder: protectedProcedure
    .input(
      z.object({
        orderItems: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number().min(1),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { orderItems } = input;
      // Data real dari DB berdasarkan ID produk yang diabmil
      const products = await db.product.findMany({
        where: { id: { in: orderItems.map((item) => item.productId) } },
      });
      // Hitung total harga
      let subtotal = 0;
      products.forEach((product) => {
        const prodQty =
          orderItems.find((item) => item.productId === product.id)!.quantity ??
          0;
        const totalPrice = prodQty * product.price;
        subtotal += totalPrice;
      });

      const tax = subtotal * 0.1; // Misal pajak 10%
      const grandTotal = subtotal + tax;
      // Buat order baru
      const order = await db.order.create({
        data: {
          grandtotal: grandTotal,
          subtotal: subtotal,
          tax: tax,
        },
      });

      const itemsOrder = await db.orderItem.createMany({
        data: products.map((product) => {
          const prodQty =
            orderItems.find((item) => item.productId === product.id)!
              .quantity ?? 0;

          // const totalPrice = prodQty * product.price;
          return {
            orderId: order.id,
            price: product.price,
            productId: product.id,
            quantity: prodQty,
          };
        }),
      });

      const paymentRequest = await createQRIS({
        amount: grandTotal,
        orderId: order.id,
      });

      await db.order.update({
        where: { id: order.id },
        data: {
          externalTransactionId: paymentRequest.id,
          paymentMethodId: paymentRequest.paymentMethod.id,
        },
      });

      return {
        order,
        itemsOrder,
        qrString:
          paymentRequest.paymentMethod.qrCode?.channelProperties?.qrString,
      };
    }),

  simulatePayment: protectedProcedure
    .input(
      z.object({
        orderId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const order = await db.order.findUnique({
        where: {
          id: input.orderId,
        },
        select: {
          externalTransactionId: true,
          paymentMethodId: true,
          grandtotal: true,
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "order not found",
        });
      }

      console.log("Order ID: ", order.externalTransactionId);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await xenditPaymentClient.simulatePayment({
        paymentMethodId: order.paymentMethodId!,
        data: {
          amount: order.grandtotal,
        },
      });
    }),

  checkOrderStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const order = await db.order.findUnique({
        where: {
          id: input.orderId,
        },
        select: {
          status: true,
          paidAt: true,
        },
      });

      if (!order?.paidAt) return false;

      return true; 
    }),
});
