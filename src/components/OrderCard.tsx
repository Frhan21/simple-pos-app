import { Button } from "@/components/ui/button";
import { toRupiah } from "@/utils/toRupiah";
import { OrderStatus } from "@prisma/client";

interface OrderCardProps {
  id: string;
  totalAmount: number;
  totalItems: number;
  status: OrderStatus;
  onFinishOrder?: (orderId: string) => void;
  isFinishOrder?: boolean;
}

export const OrderCard = ({
  id,
  totalAmount,
  totalItems,
  status,
  onFinishOrder,
  isFinishOrder,
}: OrderCardProps) => {
  // const handleFinishOrder = () => {};

  const getBadgeColor = () => {
    switch (status) {
      case OrderStatus.AWAITING_PAYMENT:
        return "bg-yellow-100 text-yellow-800";
      case OrderStatus.DONE:
        return "bg-green-100 text-green-800";
      case OrderStatus.PROCESSING:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <div className="mb-3 flex flex-col gap-4">
        <div>
          <h4 className="text-muted-foreground text-sm font-medium">
            Order ID
          </h4>
          <p className="font-mono text-sm">{id}</p>
        </div>
        <div
          className={`w-fit rounded-full px-2 py-1 text-xs font-medium ${getBadgeColor()}`}
        >
          {status}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-muted-foreground text-sm font-medium">
            Total Amount
          </h4>
          <p className="text-lg font-bold">{toRupiah(totalAmount)}</p>
        </div>
        <div>
          <h4 className="text-muted-foreground text-sm font-medium">
            Total Items
          </h4>
          <p className="text-lg font-bold">{totalItems}</p>
        </div>
      </div>

      {status === OrderStatus.PROCESSING && (
        <Button
          onClick={() => {
            if (onFinishOrder) {
              onFinishOrder(id);
            }
            return;
          }}
          className="w-full"
          size="sm"
          disabled={isFinishOrder}
        >
          {isFinishOrder ? "Processing..." : "Finish Order"};
        </Button>
      )}
    </div>
  );
};
