---
name: mermaid-flow-player-combos
description: >-
  Applies proven attribute combinations to <mermaid-flow-player> for common
  products: a minimal chrome-less embed, a full-featured dark viewer with
  minimap, and an interactive click-through viewer. Use this skill when asked
  for a complete "minimal", "kiosk", "dark mode explorer", or "interactive
  explorer" diagram setup rather than one attribute at a time. Do not use when
  only a single aspect changes — use the specific skill
  (mermaid-flow-player-controls, mermaid-flow-player-themes,
  mermaid-flow-player-modes, mermaid-flow-player-minimap).
---

# Mermaid Flow Player Key Combinations

## Critical rules

- Requires the element script on the page — set it up per mermaid-flow-player-embed (pinned CDN tag with SRI).
- Attributes compose without conflicts; these three combinations are the tested reference points.

## Recipes

| Goal                    | Attributes                                  |
| ----------------------- | ------------------------------------------- |
| Minimal, chrome-less    | `controls="none"`                           |
| Full dark with minimap  | `controls="full" minimap theme="dark"`      |
| Interactive viewer      | `mode="interactive" controls="viewer"`      |

Add `narration="false"` to the minimal recipe only under `auto.js`, which turns
captions on by default. An authored element has no caption area unless asked.

## Workflow

1. Ensure the CDN script tag is on the page.
2. Pick the recipe closest to the goal:

   ```html
   <mermaid-flow-player controls="full" minimap theme="dark">
   flowchart LR
   A[Hard] -->|Text| B(Round)
   B --> C{Decision}
   C -->|One| D[Result 1]
   C -->|Two| E[Result 2]
   </mermaid-flow-player>
   ```

3. Adjust individual attributes with the specific sibling skills if the recipe is close but not exact.
4. Validate as below.

## Validation

- Minimal: expect just the rendered diagram — no toolbar, no narration area.
- Full dark: expect a dark surface and the full control bar. The minimap inset
  shows only when the diagram is bigger than its container — see
  mermaid-flow-player-minimap.
- Interactive viewer: expect zoom/fit tools plus click-to-navigate nodes, no transport buttons.
