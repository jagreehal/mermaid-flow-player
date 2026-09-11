---
name: mermaid-flow-player-api
description: >-
  Drives a Mermaid diagram from JavaScript with createFlowPlayer — the required
  source option, hand-written step scenarios, and what counts as a step in each
  diagram type. Use this skill when the walk has to be written in code rather
  than left to the element's own playback: specific steps, notes per step,
  waits, or playback driven by application state. Do not use for declarative
  attributes on <mermaid-flow-player> — use mermaid-flow-player-options and
  mermaid-flow-player-embed. Do not use for exporting a file
  (mermaid-flow-player-animated-svg).
---

# Mermaid Flow Player API

## Critical rules

- **`source` is required and is the diagram's Mermaid text.** The player reads
  the diagram's structure from the source, never from the rendered SVG, which is
  why a step names the id the author wrote (`A`, `Still`, `Alice`) instead of
  whatever id Mermaid stamped on an element. Passing the wrong text for the
  rendered diagram fails loudly rather than animating half of it.
- `await player.ready()` before playing anything.
- A step naming a node or edge the diagram does not have is refused. There is no
  partial mode: fix the step or fix the diagram.

## Workflow

1. Ensure Mermaid and the player are on the page, per mermaid-flow-player-embed.
2. Create the player from the same text the diagram was rendered from:

   ```html
   <script type="module">
     import { createFlowPlayer } from 'https://cdn.jsdelivr.net/npm/mermaid-flow-player@latest/index.js';

     const diagram = document.getElementById('diagram');
     const player = createFlowPlayer({ root: diagram, source: diagram.textContent });
     await player.ready();

     await player.play([
       { type: 'node', id: 'A', note: 'We check the caller is who they say.' },
       { type: 'edge', from: 'A', to: 'B' },
       { type: 'node', id: 'B', note: 'Then we load their profile.' },
       { type: 'wait', ms: 600 },
     ]);
   </script>
   ```

3. Validate as below.

## Step types

| Step                                          | What it does                                  |
| --------------------------------------------- | --------------------------------------------- |
| `{ type: 'node', id, note?, state?, ms? }`     | Lights a node. `note` is what to say for it    |
| `{ type: 'edge', from, to, key?, ms? }`        | Runs an arrow between two nodes                |
| `{ type: 'wait', ms }`                         | Time with nothing happening                    |
| `{ type: 'reset', keepVisited? }`              | Clears back to the start                       |

Where a pair of nodes carries more than one edge, `from`/`to` can only name the
first. Add `key` to name a later one: `key: 'A->B#1'`.

`player.path('A', 'B', 'C')` builds the node steps for a straight run, when no
notes or waits are wanted.

## What a step is, per diagram type

All seven work through the same `play()` call; what counts as a step differs
because what a reader follows differs.

| Type                       | A step is                                        |
| -------------------------- | ------------------------------------------------ |
| flowchart, state, class, ER | a node, and the edge taken to reach it          |
| sequence                   | a **message** — participants are the cast, arrows are the plot |
| gantt, journey             | a task, in the order written                     |

## When it refuses

`FlowPlayerError` carries a `code` to switch on and the ids it is about in
`subjects`:

| Code                   | What happened                                             |
| ---------------------- | --------------------------------------------------------- |
| `BINDING_INCOMPLETE`   | The drawing and the source disagree — usually the wrong source was passed |
| `UNSUPPORTED_DIAGRAM`  | A diagram type this library does not animate, named in the message |
| `PARSE_FAILED`         | Mermaid could not read the source                          |
| `UNKNOWN_NODE` / `UNKNOWN_EDGE` | A step named something the diagram has not     |

```javascript
try {
  await player.play(steps);
} catch (error) {
  if (error.code === 'UNKNOWN_NODE') console.error('No such node:', error.subjects);
}
```

## Validation

- Play the scenario; expect each named node and edge to light in the written
  order, and the narration to follow the `note` on each step.
- Pass deliberately wrong `source` text; expect `BINDING_INCOMPLETE` naming what
  it could not find, rather than a half-animated diagram.
- On a sequence diagram, expect `player.getCurrentNode()` to answer with a
  message (`"Client->API"`), not a participant.
