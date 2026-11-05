-- Drop redundant counter: UI reads products via _count relation, column was never maintained.
ALTER TABLE "categories" DROP COLUMN "productCount";
