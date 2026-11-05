import { Check, Clock3, Loader2, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { toRupiah } from "@/utils/toRupiah";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: { name: string };
};

interface OrderCardProps {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  paidAt: Date | null;
  createdAt: Date;
  orderItems: OrderItem[];
  onFinishOrder?: (orderId: string) => void;
  isFinishOrder?: boolean;
}

const statusCopy = {
  [OrderStatus.AWAITING_PAYMENT]: "Awaiting payment",
  [OrderStatus.PAID]: "Ready to finish",
  [OrderStatus.DONE]: "Completed",
};

const statusTone = {
  [OrderStatus.AWAITING_PAYMENT]: "bg-[#fff1c2] text-[#5b4300]",
  [OrderStatus.PAID]: "bg-[#dcecff] text-[#173b63]",
  [OrderStatus.DONE]: "bg-[#dff7d8] text-[#214b2b]",
};

const formatDateTime = (value: Date) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const OrderCard = ({
  id,
  totalAmount,
  status,
  paidAt,
  createdAt,
  orderItems,
  onFinishOrder,
  isFinishOrder,
}: OrderCardProps) => {
  const itemCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = Math.max(totalAmount - subtotal, 0);
  const reference = id.slice(0, 8).toUpperCase();

  return (
    <article className="bg-card text-card-foreground ring-border overflow-hidden rounded-sm ring-1">
      <div className="bg-muted/55 flex items-start justify-between gap-4 px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="bg-foreground text-background grid size-9 shrink-0 place-items-center rounded-sm">
            <ReceiptText className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="font-bold tracking-tight">Order #{reference}</h3>
            <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
              <Clock3 className="size-3" aria-hidden="true" />
              {formatDateTime(paidAt ?? createdAt)}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
            statusTone[status],
          )}
        >
          {statusCopy[status]}
        </span>
      </div>

      <div className="px-5 py-5">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
          <p className="text-muted-foreground text-xs">Qty × unit price</p>
        </div>

        <ul className="space-y-3" aria-label={`Items in order ${reference}`}>
          {orderItems.map((item) => (
            <li
              key={item.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {item.product.name}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
                  {item.quantity} × {toRupiah(item.price)}
                </p>
              </div>
              <p className="text-sm font-semibold tabular-nums">
                {toRupiah(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <div className="my-5 flex items-center gap-2" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, index) => (
            <span key={index} className="bg-border h-px flex-1" />
          ))}
        </div>

        <div className="mb-4 space-y-2 text-sm tabular-nums">
          <div className="text-muted-foreground flex justify-between gap-4">
            <span>Subtotal</span>
            <span>{toRupiah(subtotal)}</span>
          </div>
          <div className="text-muted-foreground flex justify-between gap-4">
            <span>Tax</span>
            <span>{toRupiah(tax)}</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-xs">Order total</p>
            <p className="mt-1 text-xl font-extrabold tracking-tight tabular-nums">
              {toRupiah(totalAmount)}
            </p>
          </div>
          {status === OrderStatus.DONE && (
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <Check className="size-3.5" aria-hidden="true" /> Closed
            </span>
          )}
        </div>

        {status === OrderStatus.PAID && (
          <Button
            onClick={() => onFinishOrder?.(id)}
            className="mt-5 h-11 w-full"
            disabled={isFinishOrder}
          >
            {isFinishOrder ? <Loader2 className="animate-spin" /> : <Check />}
            {isFinishOrder ? "Finishing order…" : "Finish order"}
          </Button>
        )}
      </div>
    </article>
  );
};
