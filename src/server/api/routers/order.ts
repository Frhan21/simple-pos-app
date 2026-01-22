import { createQRIS, xenditPaymentClient } from "@/server/xendit";
import { OrderStatus, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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

      if (!order.paymentMethodId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "payment method not found",
        });
      }

      console.log("Order ID: ", order.externalTransactionId);

      await xenditPaymentClient.simulatePayment({
        paymentMethodId: order.paymentMethodId,
        data: {
          amount: order.grandtotal,
        },
      });

      await db.order.update({
        where: {
          id: input.orderId,
        },
        data: {
          paidAt: new Date(),
          status: OrderStatus.PROCESSING,
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

  getOrders: protectedProcedure
    .input(
      z.object({
        status: z.enum(["ALL", ...Object.keys(OrderStatus)]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const whereClause: Prisma.OrderWhereInput = {};

      switch (input.status) {
        case OrderStatus.AWAITING_PAYMENT:
          whereClause.status = OrderStatus.AWAITING_PAYMENT;
          break;
        case OrderStatus.PROCESSING:
          whereClause.status = OrderStatus.PROCESSING;
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
          _count: {
            select: {
              orderItems: true,
            },
          },
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
      const { db } = ctx;

      const order = await db.order.findUnique({
        where: {
          id: input.orderId,
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

      if (order.status !== OrderStatus.PROCESSING) {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Payment is Not Processing",
        });
      }

      return await db.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: OrderStatus.DONE,
        },
      });
    }),

  getSalesRepost: protectedProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    const paidOrdersQuery = db.order.findMany({
      where: {
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
