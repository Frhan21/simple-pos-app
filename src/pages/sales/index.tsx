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
import { useState, type ReactElement } from "react";
import { toast } from "sonner";
import type { NextPageWithLayout } from "../_app";

const SalesPage: NextPageWithLayout = () => {
  const [filteredOrder, setFilterOrder] = useState<OrderStatus | "ALL">("ALL");
  const { data: orders } = api.order.getOrders.useQuery({
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
      toast("Finished Order");
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

      <div className="bg-card ring-border p-4 ring-1 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Orders</h2>
          <Select defaultValue="ALL" onValueChange={handleFilterOrder}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih filter...." />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="ALL">ALL</SelectItem>
              {Object.keys(OrderStatus).map((orderStatus, i) => {
                return (
                  <SelectItem key={i} value={orderStatus}>
                    {OrderStatus[orderStatus as keyof typeof OrderStatus]}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {orders?.map((order) => (
            <OrderCard
              key={order.id}
              id={order.id}
              status={order.status}
              totalAmount={order.grandtotal}
              totalItems={order._count.orderItems}
              isFinishOrder={
                isFinishOrder && order.id === finishOrderVariable.orderId
              }
              onFinishOrder={handleFinishOrder}
            />
          ))}
        </div>
      </div>
    </>
  );
};

SalesPage.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SalesPage;
