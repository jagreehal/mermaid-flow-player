---
name: mermaid-flow-player-themes
description: >-
  Sets the visual theme of a <mermaid-flow-player> element to light, dark, or
  auto (follows the OS/browser color scheme) via the theme attribute. Use this
  skill when matching an animated Mermaid diagram to a dark site, forcing a
  light diagram, or making it follow prefers-color-scheme. Do not use for the
  basic embed — use mermaid-flow-player-embed. Do not use for restyling
  individual node states or custom colors; that is the createFlowPlayer theme
  option in the library API, not an element attribute.
---

# Mermaid Flow Player Themes

## Critical rules

- Requires the element script on the page — set it up per mermaid-flow-player-embed.
- One attribute, three values: `theme="light"` (default), `theme="dark"`, `theme="auto"` (tracks `prefers-color-scheme`).

## Workflow

1. Ensure the CDN script tag is on the page.
2. Set the theme:

   ```html
   <mermaid-flow-player theme="dark">
   flowchart LR
   A[Hard] -->|Text| B(Round)
   B --> C{Decision}
   C -->|One| D[Result 1]
   C -->|Two| E[Result 2]
   </mermaid-flow-player>
   ```

3. Validate as below.

## Validation

- Open the page; `dark` expects a dark diagram surface regardless of OS setting.
- With `auto`, toggle the OS/browser color scheme; expect the diagram to follow.
