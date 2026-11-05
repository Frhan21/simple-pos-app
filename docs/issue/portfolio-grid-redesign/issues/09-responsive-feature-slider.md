# Responsive feature slider

Status: resolved

## What to build

Turn the “Built around the sale” feature cards into an intentional horizontal slider on mobile and tablet while preserving the four-column desktop grid. Support touch swipe, trackpad scrolling, visible Previous/Next controls, slide position feedback, snap alignment, and reduced-motion behavior.

## Blocked by

- 06-landing-composition-and-brand-mark.md

## Acceptance criteria

- [x] Mobile and tablet show a horizontally swipeable, snap-aligned feature slider.
- [x] Previous and Next controls move one card at a time and expose accessible labels.
- [x] Current slide and total slide count are visible and announced.
- [x] Controls correctly disable at the first and final cards.
- [x] Reduced-motion preference avoids smooth spatial animation.
- [x] Desktop at `lg` and above remains a four-column grid without slider controls.
- [x] Typecheck, targeted lint, design checks, and build pass.

## Comments

Added a responsive feature carousel below the existing section heading. Mobile shows one card with a deliberate next-card peek; tablet shows a wider partial rail; both support native swipe/trackpad scrolling, mandatory snap points, Previous/Next controls, a live position count, correct boundary states, and reduced-motion-aware programmatic movement. At `lg` and above the component returns to the existing four-column grid and hides carousel controls. Typecheck, targeted ESLint, Impeccable detection, and production build pass. Taste lint reports only pre-existing shadow/divider/grid findings elsewhere in the same landing files.
