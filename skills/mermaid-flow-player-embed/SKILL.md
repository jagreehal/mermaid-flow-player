---
name: mermaid-flow-player-embed
description: >-
  Embeds an animated Mermaid diagram on any web page with mermaid-flow-player
  loaded from CDN — either as a <mermaid-flow-player> element you author, or by
  upgrading the .mermaid blocks a site already renders. Use this skill when
  adding an animated or playable Mermaid diagram to HTML, docs, or a blog, when
  making existing Mermaid diagrams on a site playable, or when a user asks to
  "animate a mermaid diagram" or "make a flowchart play". Do not use when
  configuring specific controls, narration, themes, or interactive stepping —
  use mermaid-flow-player-controls, mermaid-flow-player-narration,
  mermaid-flow-player-themes, or mermaid-flow-player-modes. Do not use for
  static (non-animated) Mermaid rendering; plain mermaid.js covers that.
---

# Embed Mermaid Flow Player

## Critical rules

- Either entry point auto-loads Mermaid from CDN when `window.mermaid` is
  missing, so no separate mermaid.js tag is needed. To pin Mermaid too, load it
  yourself (with its own SRI) before the player script.
- Load exactly one entry point per page, pinned and integrity-checked.
- Put raw Mermaid source directly inside the element — no `<pre>`, no code
  fence, no escaping beyond normal HTML.
- The two entry points have **different narration defaults**. See Constraints.

## Choose an entry point

| Situation | Entry point |
| --- | --- |
| You are authoring the markup | `mermaid-flow-player.element.js` — you write `<mermaid-flow-player>` yourself |
| The site already renders `.mermaid` blocks (docs generator, blog, CMS) | `auto.js` — upgrades every `.mermaid` block in place, no markup changes |

## Workflow — authored element

1. Add the script tag to `<head>` (or before `</body>`):

   ```html
   <script
     src="https://cdn.jsdelivr.net/npm/mermaid-flow-player@1.0.0/mermaid-flow-player.element.js"
     integrity="sha384-IaPx9du+pVkF99Y7U2x0FMLWhBXCieuwVWQNjyrrfS85TgtjV1fjnb+1YWlSOz6N"
     crossorigin="anonymous"></script>
   ```

2. Wrap the diagram source:

   ```html
   <mermaid-flow-player>
   flowchart LR
   A[Hard] -->|Text| B(Round)
   B --> C{Decision}
   C -->|One| D[Result 1]
   C -->|Two| E[Result 2]
   </mermaid-flow-player>
   ```

## Workflow — upgrade existing `.mermaid` blocks

1. Add the module script once; it needs no other markup:

   ```html
   <script
     type="module"
     src="https://cdn.jsdelivr.net/npm/mermaid-flow-player@1.0.0/auto.js"
     integrity="sha384-JDc8KYOKlH+/daSzpHrQrKlViE1boxnczL2o+85HCdXFGOrImuYfcorO+neLFNzF"
     crossorigin="anonymous"></script>
   ```

2. Leave the existing `.mermaid` blocks alone. Each is replaced by a
   `<mermaid-flow-player>` carrying its id and classes, so page CSS and anchor
   links still resolve.

## Bumping the pinned version

Recompute the hash for the new URL:

```sh
curl -sL <url> | openssl dgst -sha384 -binary | openssl base64 -A
```

## Validation

- Open the page; expect the rendered diagram with playback controls.
- Press Play; expect nodes to highlight in sequence.
- With `auto.js`, expect each former `.mermaid` block to be a
  `<mermaid-flow-player>` in the inspector.

## Constraints

- Narration defaults differ by entry point: `auto.js` turns the caption area on
  (opt-out via `narration="false"`), the authored element leaves it off (opt-in
  via `narration` or `narration-text`). See mermaid-flow-player-narration.
- `auto.js` skips any `.mermaid` block already inside a `<mermaid-flow-player>`,
  so it is safe to load alongside authored elements.
- All other defaults are the same either way; attributes on the element override
  them (see the sibling mermaid-flow-player-* skills).
