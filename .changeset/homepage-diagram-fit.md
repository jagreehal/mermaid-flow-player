---
'docs': patch
---

Fix homepage diagrams rendering wider than their box on load.

The homepage CSS lived in an MDX `<style>` block, and MDX renders a style tag
where it is written: in the body, after the markup. The players upgrade and fit
themselves as they are parsed, so each one measured the full content column
(1044px). Only then did the stylesheet parse and narrow the job columns to
619px, leaving every demo fitted to a width that no longer existed. Readers got
a diagram overflowing its box, and had to pan or find the Fit button.

The styles moved into a component, which Astro hoists into `<head>`, so the grid
is in force before anything renders.

The architecture demo also had to shrink. `fitView()` will not scale below
`minReadableScale` (0.6), preferring to overflow and pan rather than go
illegible, so a diagram wider than `column / 0.6` overflows by design. At 1165px
in a 619px column that one did. Shorter node labels bring it under the limit.

`tests/e2e/homepage-fit.spec.ts` asserts no player on the page renders wider
than its container.
