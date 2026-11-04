# Animated landing refinement

Status: resolved

## What to build

Refine the approved landing page using the FigCraft reference as interaction inspiration without copying it. Add a responsive interactive 3D POS preview, purposeful Motion animations, horizontal feature category cards with larger symbols, official technology logos, an FAQ closing section with Open app CTA, binary light/dark theme behavior, and grid treatment across every landing section.

## Blocked by

- 03-management-data-tables.md

## Acceptance criteria

- [x] Theme defaults to system but the control toggles directly between light and dark.
- [x] Hero contains a realistic responsive POS interface with depth and motion.
- [x] Motion respects `prefers-reduced-motion`.
- [x] Feature categories use horizontal cards, large symbols, and distinct interactions.
- [x] Technology section uses recognizable official stack logos.
- [x] Final generic CTA is replaced by an FAQ and Open app action.
- [x] Grid styling continues through the full landing page.
- [x] Mobile and desktop layouts remain usable.

## Comments

Implemented an interactive CSS-3D POS hero with Motion, horizontal feature rail, technology logo grid, accessible animated FAQ, binary theme toggle, and continuous section grid treatment. Typecheck and production build pass; ESLint has no errors. Code review findings for reduced motion, FAQ relationships, false affordances, decorative controls, and pre-hydration theme switching were addressed. Real-browser cloud QA could not start because Browser Use credentials are not configured (`browser-harness auth login` required), so visual screenshot verification remains uncompleted.
