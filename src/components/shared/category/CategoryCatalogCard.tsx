import React from "react";
import { Folder, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface CategoryCatalogCardProps {
  name: string;
  productCount: number;
  isSelected?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const CategoryCatalogCard: React.FC<CategoryCatalogCardProps> = ({
  name,
  productCount,
  onEdit,
  onDelete,
}) => (
  <article className="border-border/70 grid grid-cols-[1fr_auto] items-center gap-4 border-t p-4 first:border-t-0 md:grid-cols-[minmax(320px,1.5fr)_minmax(160px,.7fr)_96px] md:px-5 md:py-3">
    <div className="flex min-w-0 items-center gap-3">
      <span className="bg-muted grid size-10 shrink-0 place-items-center">
        <Folder className="size-4" />
      </span>
      <h2 className="truncate font-semibold">{name}</h2>
    </div>
    <div className="hidden text-right font-medium tabular-nums md:block">
      {productCount}{" "}
      <span className="text-muted-foreground font-normal">
        {productCount === 1 ? "product" : "products"}
      </span>
    </div>
    <div className="flex items-center justify-end gap-2">
      <span className="text-muted-foreground text-sm md:hidden">
        {productCount}
      </span>
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
            Edit category
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 />
            Delete category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </article>
);
