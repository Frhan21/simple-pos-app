# Portfolio Grid Redesign

Status: ready-for-agent

## Summary

Redesign Simple POS into a portfolio-ready product with a public English landing page and a precise monochrome editorial application UI. The visual system combines flat achromatic surfaces, a subtle square grid requested by the owner, strong Schibsted Grotesk typography, restrained mint accents, and responsive operational layouts.

## Product goals

- Make `/` a public portfolio page that explains the product, features, and stack.
- Keep authenticated application routes and all existing business behavior intact.
- Improve the dashboard ordering experience and management scanability.
- Replace product/category desktop card grids with responsive data tables.
- Support light, dark, and system themes as first-class presentations.

## Visual direction

- Landing: “The printed annual” art direction adapted to software; the POS receipt and interface become the editorial material.
- App: flat achromatic operational UI; color is reserved for actions, state, and selected data.
- Typeface: Schibsted Grotesk across display and UI.
- Palette: neutral paper/ink surfaces with a restrained mint action accent; no gradients, glass, decorative shadows, or tinted icon boxes.
- The requested grid appears as a subtle canvas texture, not as heavy card chrome.

## Scope

### Public landing

- Public `/` route with navigation, hero, static product UI, feature explanation, stack, CTA, and footer.
- Auth-aware CTA: signed-in users open `/dashboard`; signed-out users open `/sign-in`.
- Static mock data only; no public tRPC requests.

### Application

- Responsive sidebar shell with product identity, navigation, theme control, and sign out.
- Redesigned order dashboard preserving category filtering, product fetching, cart state, and checkout sheet.
- Products and Categories use desktop tables and mobile row cards while preserving all existing forms and mutations.
- Sales adopts the updated shell and surface language without changing behavior.

## Non-goals

- Database, Prisma schema, tRPC, Clerk configuration, Supabase, Xendit, or cart domain changes.
- New analytics or invented portfolio proof.
- New test framework.

## Accessibility and states

- Visible focus states and semantic controls.
- At least 44px touch targets for primary mobile actions.
- Reduced-motion support.
- Loading skeletons, useful empty states, and clear action labels.
- Responsive layouts at 390, 768, and 1440px without horizontal page overflow.

## Verification seam

Approved strategy: `npm run lint`, `npm run typecheck`, `npm run build`, plus real-browser smoke testing for public routing, auth CTA, theme switching, responsive shell, product/category actions, and cart interactions.
