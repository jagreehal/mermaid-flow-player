---
name: mermaid-flow-player-controls
description: >-
  Configures which control buttons a <mermaid-flow-player> element shows using
  the controls attribute presets none, playback, viewer, or full. Use this
  skill when hiding player controls, showing only play/pause, adding zoom and
  export buttons, or when a user asks for a "chrome-less", "read-only", or
  "fully loaded" diagram player. Do not use for the basic embed itself — use
  mermaid-flow-player-embed. Do not use for narration visibility
  (mermaid-flow-player-narration) or interactive click-through
  (mermaid-flow-player-modes).
---

# Mermaid Flow Player Controls Presets

## Critical rules

- Requires the element script on the page — set it up per mermaid-flow-player-embed.
- Pick exactly one preset via the `controls` attribute; omitting it gives the default playback controls.
- `playback` and `full` adapt to `mode="interactive"`: the reader drives the walkthrough by clicking, so play/prev/next drop out and only Restart and All Paths remain from the transport group.

## Presets

| Attribute             | Result                                          |
| --------------------- | ----------------------------------------------- |
| `controls="none"`     | No buttons at all (embed-only, chrome-less)     |
| `controls="playback"` | Play/pause/step transport only (the default)    |
| `controls="viewer"`   | Zoom out, fit, zoom in                          |
| `controls="full"`     | Transport + viewer + speed, search, and SVG copy/download/open |

An unrecognised value is read as a space-separated button list, so a bar the
presets don't cover needs no new preset:

```html
<mermaid-flow-player controls="play-pause next fit">
```

Valid tokens: `play-pause`, `restart`, `previous`, `next`, `speed`,
`all-paths`, `zoom-out`, `fit`, `zoom-in`, `fullscreen`, `focus`, `search`,
`copy-svg`, `download-svg`, `open-svg`. Unknown tokens are dropped silently —
note it is `play-pause`, not `play`. If no token survives, the default playback
bar is used, so a typo shows a full bar rather than an empty one.

## Workflow

1. Ensure the CDN script tag is on the page.
2. Set the preset:

   ```html
   <mermaid-flow-player controls="playback">
   flowchart LR
   A[Hard] -->|Text| B(Round)
   B --> C{Decision}
   C -->|One| D[Result 1]
   C -->|Two| E[Result 2]
   </mermaid-flow-player>
   ```

3. Validate as below.

## Validation

- Open the page; expect only the buttons of the chosen preset (`none` shows no toolbar; `full` shows transport, zoom, and speed).
