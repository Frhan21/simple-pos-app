import { cn } from "@/lib/utils";

type CategoryFilterCardProps = {
  name: string;
  productCount: number;
  isSelected: boolean;
  onClick: () => void;
};

export const CategoryFilterCard = ({
  name,
  productCount,
  isSelected,
  onClick,
}: CategoryFilterCardProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={isSelected}
    className={cn(
      "flex h-11 shrink-0 items-center gap-2 rounded-sm px-4 text-sm font-semibold transition-colors focus-visible:ring-2",
      isSelected
        ? "bg-foreground text-background"
        : "bg-card text-muted-foreground ring-border hover:bg-muted hover:text-foreground ring-1",
    )}
  >
    <span>{name}</span>
    <span
      className={cn(
        "tabular-nums",
        isSelected ? "text-background/65" : "text-muted-foreground",
      )}
    >
      {productCount}
    </span>
  </button>
);
