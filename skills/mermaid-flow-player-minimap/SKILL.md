---
name: mermaid-flow-player-minimap
description: >-
  Adds a minimap overview to a <mermaid-flow-player> element via the minimap
  boolean attribute, so readers can orient themselves while panning and zooming
  large Mermaid diagrams. Use this skill when a diagram is big enough to
  scroll/zoom and needs an overview inset, or a user asks for a "minimap" or
  "overview panel". Do not use for the zoom/fit buttons themselves — those are
  controls presets, use mermaid-flow-player-controls. Do not use for the basic
  embed — use mermaid-flow-player-embed.
---

# Mermaid Flow Player Minimap

## Critical rules

- Requires the element script on the page — set it up per mermaid-flow-player-embed.
- `minimap` is a boolean attribute — present means on; it is off by default.
- The minimap only appears once there is something off-screen. While the whole diagram fits the viewport it stays hidden rather than covering the diagram with a thumbnail of the diagram, so a small diagram shows no inset even with the attribute set.

## Workflow

1. Ensure the CDN script tag is on the page.
2. Add the attribute:

   ```html
   <mermaid-flow-player minimap>
   flowchart LR
   A[Hard] -->|Text| B(Round)
   B --> C{Decision}
   C -->|One| D[Result 1]
   C -->|Two| E[Result 2]
   </mermaid-flow-player>
   ```

3. Validate as below.

## Validation

- Open the page with a diagram bigger than its container; expect a small overview inset over the diagram.
- Zoom or pan; expect the minimap viewport rectangle to track the visible region.
- Zoom back out until the whole diagram fits; expect the inset to disappear. No inset on a diagram that already fits is correct, not a failure.
