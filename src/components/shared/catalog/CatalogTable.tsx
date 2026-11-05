import type { ReactNode } from "react";

export function CatalogTable({
  headers,
  children,
  headerClassName = "md:grid-cols-[minmax(320px,1.5fr)_minmax(160px,.7fr)_96px]",
}: {
  headers: string[];
  children: ReactNode;
  headerClassName?: string;
}) {
  return (
    <div className="bg-card ring-border overflow-hidden ring-1">
      <div
        className={`text-muted-foreground hidden items-center gap-4 px-5 py-3 text-sm md:grid ${headerClassName}`}
      >
        {headers.map((header, index) => (
          <div
            key={header}
            className={
              index === 2 ? "pr-3 text-right" : index > 2 ? "text-right" : ""
            }
          >
            {header}
          </div>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function CatalogEmpty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card ring-border grid min-h-64 place-items-center p-8 text-center ring-1">
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      </div>
    </div>
  );
}
