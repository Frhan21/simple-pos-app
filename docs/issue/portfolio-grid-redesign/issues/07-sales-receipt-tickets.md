# Sales receipt tickets

Status: resolved

## What to build

Redesign the Sales order list as always-expanded receipt tickets. Extend the existing `getOrders` response to include each order item's product name, captured unit price, and quantity, then render those values as a scannable ticket while preserving status filtering and the Finish order action.

## Blocked by

- 03-management-data-tables.md

## Acceptance criteria

- [x] `getOrders` returns tenant-scoped order items with product name, unit price, and quantity.
- [x] Every order ticket always shows its item lines, quantities, unit prices, and line totals.
- [x] Ticket totals reconcile with the existing order grand total.
- [x] Status, payment/created time, and shortened order reference remain scannable.
- [x] Paid orders retain the Finish order action and pending state.
- [x] Loading, empty, mobile, light, and dark states are handled.
- [x] Existing order filtering and business behavior remain unchanged.
- [x] Verification uses typecheck, lint, build, and available smoke checks; no test runner is added.

## Comments

Extended the tenant-scoped order query with captured item prices, quantities, product names, and order timestamps. Replaced summary cards with always-expanded receipt tickets that reconcile subtotal, tax, and grand total. Preserved filtering and Finish order behavior, and added loading, empty, success, and error feedback. Typecheck and build pass; lint has no errors.
