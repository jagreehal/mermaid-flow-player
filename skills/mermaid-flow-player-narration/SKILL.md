---
name: mermaid-flow-player-narration
description: >-
  Controls the narration/caption area of a <mermaid-flow-player> element — the
  text line that describes each step during playback — via the narration and
  narration-text attributes. Use this skill when showing step captions under an
  animated Mermaid diagram, setting placeholder text before playback, or hiding
  the narration area. Do not use for spoken audio, karaoke, or chapter
  walkthroughs of sequence diagrams — use
  mermaid-flow-player-narrated-walkthrough. Do not use for the basic embed —
  use mermaid-flow-player-embed.
---

# Mermaid Flow Player Narration

## Critical rules

- Requires the element script on the page — set it up per mermaid-flow-player-embed.
- Narration is opt-in: without an attribute (or with `narration="false"`) no narration area is rendered.

## Options

| Attribute                 | Result                                                       |
| ------------------------- | ------------------------------------------------------------ |
| `narration`               | Shows the narration area, empty until playback starts        |
| `narration="false"`       | No narration area (same as default)                          |
| `narration-text="…"`      | Shows the area with initial static text, replaced per step   |

## Workflow

1. Ensure the CDN script tag is on the page.
2. Choose one option:

   ```html
   <mermaid-flow-player narration-text="Follow the decision path">
   flowchart LR
   A[Hard] -->|Text| B(Round)
   B --> C{Decision}
   C -->|One| D[Result 1]
   C -->|Two| E[Result 2]
   </mermaid-flow-player>
   ```

3. Validate as below.

## Validation

- Open the page; with `narration-text` expect the given text under the diagram before playback.
- Press Play; expect the text to update with each step (node labels by default).
