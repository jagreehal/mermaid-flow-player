# mermaid-flow-player

Animate Mermaid-rendered diagrams (flowcharts, sequence, state, gantt, journey, class, ER) with a semantic API: target nodes by ID (e.g. `A`, `B`, `X1`) and play scenarios (steps over time) without depending on Mermaid's internal DOM structure.

Published to [npm](https://www.npmjs.com/package/mermaid-flow-player). Use via **CDN** with no install required, or `npm install mermaid-flow-player`.

## Quick start (one script)

Drop a single script onto a page and any Mermaid diagram becomes a player. Mermaid is auto-loaded from CDN if it isn't already present, styles are injected for you, and controls + narration wire themselves up.

### Web component

```html
<script src="https://cdn.jsdelivr.net/npm/mermaid-flow-player/mermaid-flow-player.element.js"></script>

<mermaid-flow-player controls>
  flowchart LR
  A[Build] --> B[Test] --> C[Deploy]
</mermaid-flow-player>
```

### Auto mode (existing `.mermaid` divs)

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/mermaid-flow-player/auto.js"></script>

<div class="mermaid">
  flowchart LR
  A[Build] --> B[Test] --> C[Deploy]
</div>
```

Both paths auto-load Mermaid from CDN if missing — you don't need a separate Mermaid script tag. Already have Mermaid loaded? They detect it and reuse your version.

### Programmatic

```html
<script type="module">
  import { createFlowPlayer } from 'https://cdn.jsdelivr.net/npm/mermaid-flow-player/index.js';

  const player = createFlowPlayer({
    root: document.getElementById('diagram'),
  });

  await player.ready();
  await player.play(player.path('A', 'B', 'C'));
</script>
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

Beyond full-auto (`auto.js`), there are smaller entry points for specific patterns:

| Entry | What it does |
|-------|--------------|
| `auto.js` | Loads Mermaid + renders + adds controls + narration to every `.mermaid` (one script) |
| `auto-init.js` | Adds controls + narration to existing rendered diagrams (assumes Mermaid already loaded) |
| `auto-enhance.js` | Reads `data-flow-*` attributes to build scenarios |
| `auto-play.js` | Autoplays diagrams on load / scroll-into-view / click |
| `mermaid-flow-player.element.js` | The web component (also auto-loads Mermaid) |

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

## Documentation

Full documentation, live examples, CDN URL builder, and API reference: [jagreehal.github.io/mermaid-flow-player](https://jagreehal.github.io/mermaid-flow-player).

## License

MIT
