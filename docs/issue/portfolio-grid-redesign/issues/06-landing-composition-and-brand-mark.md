# Landing composition and brand mark

Status: resolved

## What to build

Polish the landing composition based on visual review: rebalance the hero toward a 1:1 text/product-preview ratio, remove unclear floating UI, strengthen feature-card contrast, give the stack section an opaque and calmer visual field with technology-specific icon treatments, improve FAQ hierarchy and focus, and introduce one reusable Simple POS brand mark.

## Blocked by

- 05-animated-landing-refinement.md

## Acceptance criteria

- [x] Hero text and product preview have a balanced desktop ratio and fit normal viewport widths without clipping.
- [x] Unclear floating hero components are removed.
- [x] Feature cards have stronger icon/type contrast and no disconnected workflow label.
- [x] Stack section has an opaque background without the page grid showing through.
- [x] Stack icons have recognizable, technology-aware color treatments.
- [x] FAQ list has stronger surface separation and a better title-to-content ratio.
- [x] A reusable Simple POS app mark is generated and used in shared brand locations.
- [x] Typecheck, lint, and build complete without errors.

## Comments

Rebalanced the hero to an even desktop split and reduced the POS preview height; removed both floating hero overlays. Feature cards now use higher-contrast icon wells and typography with no disconnected workflow label. Stack uses an opaque charcoal field and technology-aware icon colors. FAQ content sits on a dedicated card with a more balanced column ratio. The external image generation request failed due to insufficient account funds, so a production-ready scalable SVG mark was designed locally and applied to the landing header and dashboard shell. Typecheck and build pass; lint has no errors.
