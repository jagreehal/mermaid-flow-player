---
name: mermaid-flow-player-animated-svg
description: >-
  Draws a Mermaid diagram and a walk through it as one standalone animated SVG
  with player.toAnimatedSvg() — no script, nothing fetched — so it plays where
  JavaScript cannot run. Use this skill when a moving diagram is wanted in a
  README, a pull request, an issue, an email, or a printed page, or when asked
  for a diagram "as a file" or "as an image". Do not use for a diagram on a page
  you control — use mermaid-flow-player-embed. Do not use for choosing which
  steps to show on a live player (mermaid-flow-player-modes).
---

# Mermaid Flow Player Animated SVG

## Critical rules

- The choice is one question: **can the page run JavaScript?** If yes, embed the
  player. If no — a README, a pull request comment, an issue, an email — export
  an SVG, because nothing else survives there.
- The export runs in a browser, off a player that is already `ready()`. It reads
  the rendered diagram, so there is no way to produce one without rendering.
- Every step must name something the diagram has. One that does not raises
  `FlowPlayerError` rather than drawing a diagram with a step silently missing.
- The result is one self-contained file: no `<script>`, no external reference.
  Do not add either — that is the whole point of it.

## Workflow

1. Render the diagram and start a player, per mermaid-flow-player-embed.
2. Export the walk:

   ```html
   <script type="module">
     import { createFlowPlayer } from 'https://cdn.jsdelivr.net/npm/mermaid-flow-player@latest/index.js';

     const diagram = document.getElementById('diagram');
     const player = createFlowPlayer({ root: diagram, source: diagram.textContent });
     await player.ready();

     const svg = player.toAnimatedSvg(
       [
         { type: 'node', id: 'A' },
         { type: 'edge', from: 'A', to: 'B' },
         { type: 'node', id: 'B' },
       ],
       { title: 'How a request is served' },
     );
   </script>
   ```

3. Save the string as a `.svg` file next to the document that references it.
4. Reference it as a Markdown image, so the alt text is there for a reader
   without images:

   ```markdown
   ![How a request is served](./docs/request-flow.svg)
   ```

5. Validate as below.

## Options

| Option        | Default                | Result                                          |
| ------------- | ---------------------- | ----------------------------------------------- |
| `stepMs`      | the player's step time | How long a step lasts when it does not say      |
| `loop`        | `true`                 | `false` holds on the last step instead          |
| `title`       | none                   | The `<title>` a screen reader announces         |
| `accent`      | `#3b82f6`              | Colour the current element is picked out in     |
| `restOpacity` | `0.28`                 | How far back everything else is held            |

## Choosing the steps

- One idea per step. A step needing two sentences is two steps.
- Follow the thing that moves — the request, the record, the message — not the
  boxes on the page.
- Stop where the story stops. A run through every node of a large diagram is a
  screensaver, not an explanation.

## Validation

- Open the `.svg` on its own in a browser; expect it to animate with no console
  errors and no network requests.
- Search the file for `<script` and for `http`; expect neither (beyond the
  `xmlns` namespace).
- Push it to a branch and view the Markdown on the forge; expect it to animate
  in the rendered README.
- Set the OS "reduce motion" preference and reload; expect the finished diagram,
  still — every step lit, nothing moving.
