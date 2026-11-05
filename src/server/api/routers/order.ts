import { createQRIS } from "@/server/xendit";
import { env } from "@/env.js";
import { OrderStatus, type Prisma } from "@/generated/prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  mapRecordNotFound,
} from "../trpc";

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
      const { db, currentUser } = ctx;
      const { orderItems } = input;

      const requestedProductIds = [
        ...new Set(orderItems.map((i) => i.productId)),
      ];

      // Scoped to the current user: other tenants' product IDs are invisible.
      const products = await db.product.findMany({
        where: {
          id: { in: requestedProductIds },
          userId: currentUser.id,
        },
      });

      if (products.length !== requestedProductIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more products not found",
        });
      }

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
      // Buat order + items atomically
      const { order, itemsOrder } = await db.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            grandtotal: grandTotal,
            subtotal: subtotal,
            tax: tax,
            userId: currentUser.id,
          },
        });

        const itemsOrder = await tx.orderItem.createMany({
          data: products.map((product) => {
            const prodQty =
              orderItems.find((item) => item.productId === product.id)!
                .quantity ?? 0;

            return {
              orderId: order.id,
              price: product.price,
              productId: product.id,
              quantity: prodQty,
            };
          }),
        });

        return { order, itemsOrder };
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
      const { db, currentUser } = ctx;
      const order = await db.order.findFirst({
        where: {
          id: input.orderId,
          userId: currentUser.id,
        },
        select: {
          status: true,
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

      if (!order.paymentMethodId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "payment method not found",
        });
      }

      console.log("Order ID: ", order.externalTransactionId);

      // Idempotent: re-clicking "Simulate payment" on an already-PAID order is a no-op.
      if (order.status === OrderStatus.PAID) {
        return;
      }

      // xendit-node's simulatePayment crashes on its own (TypeError reading
      // 'slice' parsing the void response) even when Xendit returns 200,
      // so call the endpoint directly and treat 2xx as accepted.
      const auth = Buffer.from(`${env.XENDIT_SECRET_KEY}:`).toString("base64");
      const simulateRes = await fetch(
        `https://api.xendit.co/v2/payment_methods/${order.paymentMethodId}/payments/simulate`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: order.grandtotal }),
        },
      );

      if (!simulateRes.ok) {
        const errBody = await simulateRes.text();
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Simulate payment failed: ${simulateRes.status} ${errBody.slice(0, 200)}`,
        });
      }

      await db.order
        .update({
          where: {
            id: input.orderId,
          },
          data: {
            paidAt: new Date(),
            status: OrderStatus.PAID,
          },
        })
        .catch(mapRecordNotFound);
    }),

  checkOrderStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, currentUser } = ctx;
      const order = await db.order.findFirst({
        where: {
          id: input.orderId,
          userId: currentUser.id,
        },
        select: {
          status: true,
          paidAt: true,
        },
      });

      if (!order?.paidAt) return false;

      return true;
    }),

  getOrders: protectedProcedure
    .input(
      z.object({
        status: z.enum(["ALL", ...Object.keys(OrderStatus)]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, currentUser } = ctx;

      const whereClause: Prisma.OrderWhereInput = {
        userId: currentUser.id,
      };

      switch (input.status) {
        case OrderStatus.AWAITING_PAYMENT:
          whereClause.status = OrderStatus.AWAITING_PAYMENT;
          break;
        case OrderStatus.PAID:
          whereClause.status = OrderStatus.PAID;
          break;
        case OrderStatus.DONE:
          whereClause.status = OrderStatus.DONE;
          break;
      }

      const orders = await db.order.findMany({
        where: whereClause,
        select: {
          id: true,
          grandtotal: true,
          status: true,
          paidAt: true,
          createdAt: true,
          orderItems: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              id: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return orders;
    }),

  updateOrderStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, currentUser } = ctx;

      const order = await db.order.findFirst({
        where: {
          id: input.orderId,
          userId: currentUser.id,
        },
        select: {
          paidAt: true,
          status: true,
          id: true,
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not Found",
        });
      }

      if (!order.paidAt) {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Order not Paid yet",
        });
      }

      if (order.status !== OrderStatus.PAID) {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Order is not PAID yet",
        });
      }

      return await db.order
        .update({
          where: {
            id: order.id,
          },
          data: {
            status: OrderStatus.DONE,
          },
        })
        .catch(mapRecordNotFound);
    }),

  getSalesRepost: protectedProcedure.query(async ({ ctx }) => {
    const { db, currentUser } = ctx;
    const paidOrdersQuery = db.order.findMany({
      where: {
        userId: currentUser.id,
        paidAt: {
          not: null,
        },
      },
      select: {
        grandtotal: true,
      },
    });

    const onGoingOrderQuery = db.order.findMany({
      where: {
        userId: currentUser.id,
        status: {
          not: "DONE",
        },
      },
      select: {
        id: true,
      },
    });

    const completeOrderQuery = db.order.findMany({
      where: {
        userId: currentUser.id,
        status: "DONE",
      },
      select: {
        id: true,
      },
    });

    const [paidOrders, onGoingOrders, completeOrder] = await Promise.all([
      paidOrdersQuery,
      onGoingOrderQuery,
      completeOrderQuery,
    ]);

    const totalRevenue = paidOrders.reduce((a, b) => {
      return a + b.grandtotal;
    }, 0);

    const totalOnGoingOrder = onGoingOrders.length;
    const totalCompleteOrder = completeOrder.length;

    return {
      totalRevenue,
      totalOnGoingOrder,
      totalCompleteOrder,
    };
  }),
});
