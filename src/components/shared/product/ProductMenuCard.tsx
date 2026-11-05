import React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toRupiah } from "@/utils/toRupiah";

interface ProductMenuCardProps {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  onAddToCart: (id: string) => void;
}

export const ProductMenuCard: React.FC<ProductMenuCardProps> = ({
  name,
  price,
  imageUrl,
  productId,
  onAddToCart,
}) => (
  <article className="group bg-card ring-border hover:bg-muted/40 flex min-w-0 flex-col p-2 ring-1 transition-colors">
    <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden">
      <Image
        unoptimized
        fill
        src={imageUrl}
        alt={name}
        className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
      />
    </div>
    <div className="flex flex-1 items-end justify-between gap-3 p-3 pb-2">
      <div className="min-w-0">
        <h3 className="truncate font-semibold tracking-tight">{name}</h3>
        <p className="text-muted-foreground mt-1 text-sm font-medium tabular-nums">
          {toRupiah(price)}
        </p>
      </div>
      <Button
        size="icon"
        onClick={() => onAddToCart(productId)}
        aria-label={`Add ${name} to cart`}
        className="size-11 shrink-0 rounded-sm"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  </article>
);
