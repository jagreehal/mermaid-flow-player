---
name: mermaid-flow-player-options
description: >-
  Tunes <mermaid-flow-player> behavior with the speed, visited, edge, autoplay,
  debug, auto-center, and sync-url attributes. Use this skill when changing
  playback speed, starting playback automatically on load, disabling
  visited-node trails or edge animation, auto-centering the active node,
  syncing zoom/pan state to the URL, or enabling debug logging. Do not use for
  control buttons (mermaid-flow-player-controls), narration
  (mermaid-flow-player-narration), themes (mermaid-flow-player-themes), or
  interactive mode (mermaid-flow-player-modes).
---

# Mermaid Flow Player Options

## Critical rules

- Requires the element script on the page — set it up per mermaid-flow-player-embed.
- Attributes combine freely; each is independent.

## Options

| Attribute          | Result                                                        |
| ------------------ | ------------------------------------------------------------- |
| `speed="2"`        | Speed multiplier. Default `1.2`; accepted range 0–10          |
| `visited="false"`  | Nodes don't keep a visited trail after the step moves on      |
| `edge="off"`       | Disables edge (arrow) animation; nodes only                   |
| `autoplay`         | Starts playback automatically once rendered                   |
| `debug`            | Verbose console logging for troubleshooting                   |
| `auto-center`      | Pans the viewport to keep the active node centered            |
| `sync-url`         | Mirrors zoom/pan state into URL query params (deep-linkable)  |
| `progress`         | Adds a "Step N of M" readout that updates as playback runs    |
| `step="3"`         | Jumps to step N once indexed; `?step=N` in the URL does the same |
| `step-ms="800"`    | Base milliseconds per step (default 1200). `speed` still divides it |
| `trigger="scroll"` | With `autoplay`, defers the start until the diagram scrolls into view |

## Workflow

1. Ensure the CDN script tag is on the page.
2. Add the attributes you need:

   ```html
   <mermaid-flow-player autoplay speed="2" auto-center>
   flowchart LR
   A[Hard] -->|Text| B(Round)
   B --> C{Decision}
   C -->|One| D[Result 1]
   C -->|Two| E[Result 2]
   </mermaid-flow-player>
   ```

3. Validate as below.

## Validation

- `autoplay`: open the page; expect the animation to start without pressing Play.
- `speed="2"`: expect steps to advance noticeably faster than an unattributed
  player — the baseline is `1.2`, not `1`, so this is roughly 1.7x, not 2x.
- `sync-url`: zoom/pan, then expect `zoom`/`x`/`y` style params in the URL.
- `trigger="scroll"`: load the page with the diagram below the fold; expect it
  to stay on step one until scrolled to.
