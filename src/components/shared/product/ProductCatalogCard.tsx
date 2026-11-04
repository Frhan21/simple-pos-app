import React from "react";
import Image from "next/image";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  <article className="border-border/70 grid gap-4 border-t p-4 first:border-t-0 md:grid-cols-[minmax(260px,1.5fr)_minmax(150px,.8fr)_minmax(130px,.6fr)_96px] md:items-center md:px-5 md:py-3">
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
    <div className="font-semibold tabular-nums md:text-right">
      {toRupiah(price)}
    </div>
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${name}`}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil />
            Edit product
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 />
            Delete product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </article>
);

const PackagePlaceholder = () => (
  <div className="text-muted-foreground grid h-full place-items-center text-xs">
    No image
  </div>
);
