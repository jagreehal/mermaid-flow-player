---
name: mermaid-flow-player-modes
description: >-
  Switches a <mermaid-flow-player> element between sequential playback and
  interactive click-through using the mode attribute. Use this skill when a
  Mermaid diagram should be explored by clicking nodes, stepped through by the
  reader choosing branches, or explicitly set to auto-sequenced playback. Do
  not use for the basic embed — use mermaid-flow-player-embed. Do not use for
  hiding or choosing control buttons (mermaid-flow-player-controls) or
  caption/audio walkthroughs (mermaid-flow-player-narrated-walkthrough).
---

# Mermaid Flow Player Modes

## Critical rules

- Requires the element script on the page — set it up per mermaid-flow-player-embed.
- `mode="sequential"` (the default) plays steps in order; `mode="interactive"` lets the reader click reachable nodes to navigate, choosing branches at decision points.

## What a step is

Stepping follows what a reader of that diagram follows, so it is not the same
thing everywhere:

| Type                        | A step is                                       |
| --------------------------- | ----------------------------------------------- |
| flowchart, state, class, ER | a node, and the edge taken to reach it          |
| sequence                    | a message — the participants are the cast, the arrows are the plot |
| gantt, journey              | a task, in the order written                    |

## Workflow

1. Ensure the CDN script tag is on the page.
2. Set the mode:

   ```html
   <mermaid-flow-player mode="interactive">
   flowchart LR
   A[Hard] -->|Text| B(Round)
   B --> C{Decision}
   C -->|One| D[Result 1]
   C -->|Two| E[Result 2]
   </mermaid-flow-player>
   ```

3. Validate as below.

## Validation

- Interactive: open the page; expect the first node highlighted and reachable nodes marked available; clicking an available node advances to it.
- Sequential: press Play; expect nodes to animate in order without clicks.
