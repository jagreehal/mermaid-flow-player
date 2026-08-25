# mermaid-flow-player

Step through your Mermaid diagrams. Add one script tag and every diagram on the
page gets play, pause and step controls, narration, and a URL that links to a
single step.

```html
<script src="https://cdn.jsdelivr.net/npm/mermaid-flow-player/auto.global.js"></script>

<div class="mermaid">
  flowchart TD
    A[Validate token] --> B[Fetch user] --> C[Render page]
</div>
```

Save that as a file, open it in a browser, and it plays. Your markup does not
change. There is no build step and no server. Mermaid loads itself if it is not
already on the page, and the CSS is bundled and injected.

**[Try it on the docs site](https://jagreehal.github.io/mermaid-flow-player/)** — paste your own diagram into the homepage and watch it play.

## Where your diagrams already live

Auto mode upgrades three shapes of markup with no configuration:

| Your markup | Emitted by |
|---|---|
| `<div class="mermaid">` / `<pre class="mermaid">` | hand-authored, Mermaid's own docs |
| `<pre><code class="language-mermaid">` | markdown-it, marked, Prism, Jekyll, Hugo, Eleventy |
| `<pre class="language-mermaid">` | Shiki, Astro, Starlight, VitePress, Docusaurus |

Each is replaced in place by a `<mermaid-flow-player>`, keeping its `id` and
your own classes.

## Authoring new diagrams

Write the diagram inside the element and set options per diagram:

```html
<script src="https://cdn.jsdelivr.net/npm/mermaid-flow-player/mermaid-flow-player.element.js"></script>

<mermaid-flow-player controls>
  flowchart LR
  A[Build] --> B[Test] --> C[Deploy]
</mermaid-flow-player>
```

There is one player implementation: the element is what auto mode produces, so
both routes get the same features.

## Install

The CDN needs no install. For a bundler:

```bash
npm install mermaid-flow-player
```

```js
import 'mermaid-flow-player/auto';
```

**CDN URL builder:** [docs site → CDN Builder](https://jagreehal.github.io/mermaid-flow-player/cdn-builder). Pick options and copy script tags or query params.

## Usage (programmatic)

```ts
import { createFlowPlayer } from 'https://cdn.jsdelivr.net/npm/mermaid-flow-player/index.js';

const root = document.getElementById("diagram");
const player = createFlowPlayer({
  root,
  persist: "visited",
  dim: "others",
  edgeMode: "bestEffort",
});

await player.ready();
await player.play(player.path("A", "B", "C", "E", "F", "G", "J"), { speed: 1.1 });
```

Use stable, simple node IDs in your Mermaid diagram (e.g. `A`, `B`, `X1`) so `path()` and steps line up.

## Features

### Multi-Diagram Support

Auto-detects and animates **7 diagram types**:

- Flowcharts, Sequence Diagrams, State Diagrams, Gantt Charts, User Journey, Class Diagrams, ER Diagrams

All diagram types use the same animation API; just change your Mermaid diagram type and the player adapts automatically.

### Narration

Display narration text that updates automatically as the animation progresses.

```html
<mermaid-flow-player controls narration>
  flowchart LR
  A[Build] --> B[Test] --> C[Deploy]
</mermaid-flow-player>
```

When `narration` is enabled but `narration-text` isn't provided, the panel shows a sensible default until the first step:

- Sequential mode: `Press Play to start`
- Interactive mode: `Click a highlighted node to begin`

Override with the `narration-text` attribute, or pass an empty string (`narration-text=""`) to suppress the default.

For programmatic control, pass per-step `note` strings:

```ts
createFlowPlayer({
  root: diagram,
  narrationTarget: '#narration',
});

await player.play([
  { type: 'node', id: 'A', note: 'Starting...' },
  { type: 'node', id: 'B', note: 'Processing...' },
]);
```

### Animation Easing

Control animation timing with **30+ easing functions**: standard CSS, back, elastic, bounce, power curves, and custom `cubic-bezier()`.

```ts
createFlowPlayer({
  root: diagram,
  easing: {
    default: 'ease-out-back',
    states: {
      active: 'ease-out-elastic',
      success: 'ease-out-bounce',
    }
  }
});
```

### Enhanced Edge Animation

**Multi-strategy edge detection** with automatic fallback:

```ts
createFlowPlayer({
  root: diagram,
  edgeMode: 'bestEffort',
  edgeDetection: {
    strategy: ['title', 'data-attr', 'text', 'path-trace'],
    debug: true,
  }
});
```

### Scenario Builder API

Build complex animations with a **fluent, chainable API**:

```ts
import { createScenarioBuilder } from 'https://cdn.jsdelivr.net/npm/mermaid-flow-player@latest/index.js';

await createScenarioBuilder()
  .node('Start', { note: 'Beginning' })
  .wait(500)
  .node('Process', { state: 'active' })
  .node('End', { state: 'success' })
  .play(player);
```

Features: chainable methods, diagram-specific builders (flowchart, sequence, state), `repeat()`, `conditional()`, template registry.

### Plugin System

Extend functionality with lifecycle hooks:

```ts
import { createFlowPlayer, type Plugin } from 'https://cdn.jsdelivr.net/npm/mermaid-flow-player@latest/index.js';
import { AnalyticsPlugin, KeyboardControlsPlugin } from 'https://cdn.jsdelivr.net/npm/mermaid-flow-player@latest/index.js';

const player = createFlowPlayer({
  root: diagram,
  plugins: [AnalyticsPlugin, KeyboardControlsPlugin],
});
```

**Built-in plugins:** AnalyticsPlugin (event tracking), KeyboardControlsPlugin (Space/R/Arrow keys).

### Interactive Mode

Step-through with user-controlled path selection:

```ts
const player = createFlowPlayer({ root: diagram, mode: 'interactive' });
await player.nextStep();
```

### Auto Modes

Beyond full-auto, there are smaller entry points for specific patterns:

| Entry | What it does |
|-------|--------------|
| `auto.global.js` | Loads Mermaid, renders, and adds controls and narration to every diagram it finds. A plain script, so it works from `file://` |
| `auto.js` | The same code as ESM, for a bundler to import |
| `auto-init.js` | Upgrades blocks on demand, so you choose when and which selector |
| `mermaid-flow-player.element.js` | The web component, for markup you are authoring yourself |

Programmatic equivalent:

```ts
import { autoInit } from 'https://cdn.jsdelivr.net/npm/mermaid-flow-player@latest/auto-init.js';
autoInit({ controls: true, narration: true });
```

### URL Query Parameter Configuration

Configure via URL without JavaScript: `page.html?theme=dark&speed=1.5&dim=none`

| Parameter | Values | Default |
|-----------|--------|---------|
| `theme` | `light`, `dark`, `auto` | `auto` |
| `speed` | 0.1 to 10 | 1.2 |
| `dim` | `none`, `others` | `others` |
| `persist` | `none`, `visited` | `visited` |
| `edge` | `off`, `bestEffort` | `off` |
| `mode` | `sequential`, `interactive` | `sequential` |
| `selector` | CSS selector (e.g. `.my-diagram`) | `.mermaid` (auto modes only) |
| `debug` | (presence) | `false` |
| `autoplay` | (presence) | `false` |

## Agent skills

Teach Claude Code, Codex, Cursor, and other compatible agents how to use this
package. [Browse them on skills.sh](https://skills.sh/s/jagreehal/mermaid-flow-player), or:

```bash
npx skills add jagreehal/mermaid-flow-player
```

See what's on offer, or install one:

```bash
npx skills add jagreehal/mermaid-flow-player --list
npx skills add jagreehal/mermaid-flow-player --skill mermaid-flow-player-embed
```

| Skill | Covers |
|-------|--------|
| `mermaid-flow-player-embed` | Getting a playable diagram on a page, either entry point |
| `mermaid-flow-player-controls` | Which buttons the toolbar shows |
| `mermaid-flow-player-modes` | Sequential playback vs interactive click-through |
| `mermaid-flow-player-themes` | Light, dark, and OS-following |
| `mermaid-flow-player-narration` | The caption line under the diagram |
| `mermaid-flow-player-narrated-walkthrough` | Captions, chapters, speech, and scroll-driven stepping |
| `mermaid-flow-player-minimap` | Overview inset for large diagrams |
| `mermaid-flow-player-options` | Speed, autoplay, edges, URL sync, and the rest |
| `mermaid-flow-player-combos` | Ready-made attribute sets for common products |

## Documentation

Full documentation, live examples, CDN URL builder, and API reference: [jagreehal.github.io/mermaid-flow-player](https://jagreehal.github.io/mermaid-flow-player).

## License

MIT
