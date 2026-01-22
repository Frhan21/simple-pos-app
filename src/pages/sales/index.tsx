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
import { OrderStatus } from "@prisma/client";
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
        <DashboardTitle>Sales Dashboard {filteredOrder}</DashboardTitle>
        <DashboardDescription>
          Track your sales performance and view analytics.
        </DashboardDescription>
      </DashboardHeader>

      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold">
            {toRupiah(salesReport?.totalRevenue ?? 0)}
          </p>
        </div>

        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">Ongoing Orders</h3>
          <p className="mt-2 text-3xl font-bold">
            {salesReport?.totalOnGoingOrder ?? 0}
          </p>
        </div>

        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">Completed Orders</h3>
          <p className="mt-2 text-3xl font-bold">
            {salesReport?.totalCompleteOrder ?? 0}
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <div className="flex justify-between">
          <h3 className="mb-4 text-lg font-medium">Orders</h3>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
