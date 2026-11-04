import type { ReactNode } from "react";

export function CatalogTable({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="bg-card ring-border overflow-hidden ring-1">
      <div className="text-muted-foreground hidden grid-cols-[minmax(260px,1.5fr)_minmax(150px,.8fr)_minmax(130px,.6fr)_96px] items-center gap-4 px-5 py-3 text-sm md:grid">
        {headers.map((header, index) => (
          <div key={header} className={index >= 2 ? "text-right" : ""}>
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
