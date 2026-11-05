import {
  DashboardDescription,
  DashboardHeader,
  DashboardLayout,
  DashboardTitle,
} from "@/components/layouts/DashboardLayout";
import { OrderCard } from "@/components/OrderCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/utils/api";
import { toRupiah } from "@/utils/toRupiah";
import { OrderStatus } from "@/generated/prisma/enums";
import Head from "next/head";
import { ReceiptText } from "lucide-react";
import { useState, type ReactElement } from "react";
import { toast } from "sonner";
import type { NextPageWithLayout } from "../_app";

const SalesPage: NextPageWithLayout = () => {
  const [filteredOrder, setFilterOrder] = useState<OrderStatus | "ALL">("ALL");
  const { data: orders, isLoading: ordersLoading } =
    api.order.getOrders.useQuery({
      status: filteredOrder,
    });

  const apiUtils = api.useUtils();

  const {
    mutate: finishedOrder,
    isPending: isFinishOrder,
    variables: finishOrderVariable,
  } = api.order.updateOrderStatus.useMutation({
    onSuccess: async () => {
      await apiUtils.order.invalidate();
      toast.success("Order finished");
    },
    onError: (error) => {
      toast.error("Could not finish order", { description: error.message });
    },
  });

  const { data: salesReport } = api.order.getSalesRepost.useQuery();

  const handleFinishOrder = (orderId: string) => {
    finishedOrder({
      orderId: orderId,
    });
  };

  const handleFilterOrder = (value: OrderStatus | "ALL") => {
    setFilterOrder(value);
  };

  return (
    <>
      <Head>
        <title>Sales - Simple POS</title>
        <meta name="description" content="Manage your sales and orders" />
      </Head>
      <DashboardHeader>
        <DashboardTitle>Sales</DashboardTitle>
        <DashboardDescription>
          Revenue and order status from the same counter workflow.
        </DashboardDescription>
      </DashboardHeader>

      <div className="bg-card ring-border mb-6 grid ring-1 sm:grid-cols-3">
        <div className="p-5 sm:border-r">
          <h2 className="text-muted-foreground text-sm">Total revenue</h2>
          <p className="mt-3 text-2xl font-bold tabular-nums">
            {toRupiah(salesReport?.totalRevenue ?? 0)}
          </p>
        </div>
        <div className="border-t p-5 sm:border-t-0 sm:border-r">
          <h2 className="text-muted-foreground text-sm">Ongoing orders</h2>
          <p className="mt-3 text-2xl font-semibold tabular-nums">
            {salesReport?.totalOnGoingOrder ?? 0}
          </p>
        </div>
        <div className="border-t p-5 sm:border-t-0">
          <h2 className="text-muted-foreground text-sm">Completed orders</h2>
          <p className="mt-3 text-2xl font-semibold tabular-nums">
            {salesReport?.totalCompleteOrder ?? 0}
          </p>
        </div>
      </div>

      <section aria-labelledby="order-tickets-title">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="order-tickets-title"
              className="text-xl font-bold tracking-tight"
            >
              Order tickets
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Every ticket shows the products, quantities, and captured sale
              prices.
            </p>
          </div>
          <Select value={filteredOrder} onValueChange={handleFilterOrder}>
            <SelectTrigger
              className="w-full sm:w-52"
              aria-label="Filter orders by status"
            >
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="ALL">All orders</SelectItem>
              {Object.keys(OrderStatus).map((orderStatus) => (
                <SelectItem key={orderStatus} value={orderStatus}>
                  {orderStatus.replaceAll("_", " ").toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {ordersLoading ? (
          <div
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <span className="sr-only">Loading order tickets…</span>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-muted h-80 animate-pulse rounded-sm"
              />
            ))}
          </div>
        ) : orders?.length ? (
          <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                id={order.id}
                status={order.status}
                totalAmount={order.grandtotal}
                paidAt={order.paidAt}
                createdAt={order.createdAt}
                orderItems={order.orderItems}
                isFinishOrder={
                  isFinishOrder && order.id === finishOrderVariable.orderId
                }
                onFinishOrder={handleFinishOrder}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card ring-border grid min-h-72 place-items-center rounded-sm p-8 text-center ring-1">
            <div>
              <ReceiptText
                className="text-muted-foreground mx-auto size-7"
                aria-hidden="true"
              />
              <h3 className="mt-4 text-lg font-bold">No order tickets found</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Try another status or create a new order from the counter.
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

SalesPage.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SalesPage;
