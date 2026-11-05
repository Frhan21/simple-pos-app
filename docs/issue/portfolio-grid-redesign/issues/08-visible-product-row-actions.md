# Visible product row actions

Status: resolved

## What to build

Replace the Products table action dropdown with directly visible Edit and Delete controls so operators can identify and use available row actions without opening a menu. Preserve the existing edit dialog, delete mutation, responsive table behavior, and accessibility labels.

## Blocked by

- 03-management-data-tables.md

## Acceptance criteria

- [x] Product rows show Edit and Delete actions without a dropdown.
- [x] Actions remain clear, keyboard accessible, and comfortably sized on mobile.
- [x] Destructive styling distinguishes Delete without overwhelming the table.
- [x] Desktop header and row columns remain aligned.
- [x] Existing edit and delete behavior remains unchanged.
- [x] Typecheck, targeted lint, and build pass.

## Comments

Replaced the overflow menu with visible Edit and Delete buttons. Both controls include icons, product-specific accessible names, keyboard focus states, and 40px mobile targets with an 8px gap. The desktop action column uses a stable 200px width, the Price column has additional width and end padding, and the shared table header accepts a page-specific grid so Categories retains its existing alignment. Typecheck, targeted ESLint, Impeccable detection, Taste lint, and production build pass; Taste reports only the existing loading-pulse warning.
