-- AlterEnum: rename PROCESSING -> PAID. Existing PROCESSING rows are remapped manually below
-- because the generated ALTER ... USING cast fails on unknown enum label.
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('AWAITING_PAYMENT', 'PAID', 'DONE');
ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING (
  CASE "status"::text WHEN 'PROCESSING' THEN 'PAID' ELSE "status"::text END::"OrderStatus_new"
);
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'AWAITING_PAYMENT';
COMMIT;
