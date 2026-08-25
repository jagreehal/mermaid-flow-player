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
- Load exactly one entry point per page.
- `@latest` keeps a page on the current release without edits. A page that must
  not change under its readers should pin a version instead, and once pinned it
  can carry an `integrity` hash — Subresource Integrity and a floating tag are
  mutually exclusive, since the bytes are meant to change.
- Put raw Mermaid source directly inside the element — no `<pre>`, no code
  fence, no escaping beyond normal HTML.
- The two entry points have **different narration defaults**. See Constraints.

## Choose an entry point

| Situation | Entry point |
| --- | --- |
| You are authoring the markup | `mermaid-flow-player.element.js` — you write `<mermaid-flow-player>` yourself |
| The site already renders diagrams (docs generator, blog, CMS) | `auto.global.js` — upgrades every `.mermaid` block and rendered ```mermaid fence in place, no markup changes |

## Workflow — authored element

1. Add the script tag to `<head>` (or before `</body>`):

   ```html
   <script src="https://cdn.jsdelivr.net/npm/mermaid-flow-player@latest/mermaid-flow-player.element.js"></script>
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

1. Add the script once; it needs no other markup:

   ```html
   <script src="https://cdn.jsdelivr.net/npm/mermaid-flow-player@latest/auto.global.js"></script>
   ```

   Use `auto.js` instead only when a bundler imports it: that build is ESM, and
   browsers refuse module scripts on a `file://` page. `auto.global.js` needs
   1.1 or newer; on an older pin the same build is named `auto.min.js`.

2. Leave the existing markup alone. Auto mode upgrades `.mermaid` blocks and
   the fences a markdown pipeline renders (`pre > code.language-mermaid`, and
   `pre.language-mermaid` from Shiki). Each is replaced by a
   `<mermaid-flow-player>` carrying its id and classes, so page CSS and anchor
   links still resolve.

## Pinning instead

When the page must not move under its readers — a published article, a
compliance context, a strict CSP — swap `@latest` for a version and add the
hash for that exact file:

```sh
curl -sL https://cdn.jsdelivr.net/npm/mermaid-flow-player@1.1.0/auto.global.js \
  | openssl dgst -sha384 -binary | openssl base64 -A
```

```html
<script
  src="https://cdn.jsdelivr.net/npm/mermaid-flow-player@1.1.0/auto.global.js"
  integrity="sha384-<computed>"
  crossorigin="anonymous"></script>
```

Recompute the hash on every version bump; a stale hash blocks the script and
the diagram silently does not render.

## Validation

- Open the page; expect the rendered diagram with playback controls.
- Press Play; expect nodes to highlight in sequence.
- Under auto mode, expect each former block or fence to be a
  `<mermaid-flow-player>` in the inspector.

## Constraints

- Narration defaults differ by entry point: auto mode turns the caption area on
  (opt-out via `narration="false"`), the authored element leaves it off (opt-in
  via `narration` or `narration-text`). See mermaid-flow-player-narration.
- Auto mode skips any block already inside a `<mermaid-flow-player>`,
  so it is safe to load alongside authored elements.
- All other defaults are the same either way; attributes on the element override
  them (see the sibling mermaid-flow-player-* skills).
