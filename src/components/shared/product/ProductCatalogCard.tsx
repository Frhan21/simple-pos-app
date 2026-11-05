import React from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toRupiah } from "@/utils/toRupiah";

export interface ProductCatalogCardProps {
  name: string;
  price: number;
  image?: string;
  category: string;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const ProductCatalogCard: React.FC<ProductCatalogCardProps> = ({
  name,
  price,
  image,
  category,
  onEdit,
  onDelete,
}) => (
  <article className="border-border/70 grid gap-4 border-t p-4 first:border-t-0 md:grid-cols-[minmax(260px,1.5fr)_minmax(150px,.8fr)_minmax(160px,.65fr)_200px] md:items-center md:gap-x-6 md:px-5 md:py-3">
    <div className="flex min-w-0 items-center gap-3">
      <div className="bg-muted relative size-14 shrink-0 overflow-hidden">
        {image ? (
          <Image src={image} alt="" fill unoptimized className="object-cover" />
        ) : (
          <PackagePlaceholder />
        )}
      </div>
      <div className="min-w-0">
        <h2 className="truncate font-semibold">{name}</h2>
        <p className="text-muted-foreground mt-1 text-sm md:hidden">
          {category}
        </p>
      </div>
    </div>
    <div className="text-muted-foreground hidden text-sm md:block">
      {category || "—"}
    </div>
    <div className="font-semibold tabular-nums md:pr-3 md:text-right">
      {toRupiah(price)}
    </div>
    <div className="flex items-center gap-2 md:justify-end">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-10 flex-1 rounded-sm px-3 sm:flex-none md:h-9"
        onClick={onEdit}
        aria-label={`Edit ${name}`}
      >
        <Pencil aria-hidden="true" />
        Edit
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:text-destructive h-10 flex-1 rounded-sm px-3 sm:flex-none md:h-9"
        onClick={onDelete}
        aria-label={`Delete ${name}`}
      >
        <Trash2 aria-hidden="true" />
        Delete
      </Button>
    </div>
  </article>
);

const PackagePlaceholder = () => (
  <div className="text-muted-foreground grid h-full place-items-center text-xs">
    No image
  </div>
);
