# mermaid-flow-player

Animate Mermaid-rendered diagrams (flowcharts, etc.) with a semantic API: target nodes by ID (e.g. `A`, `B`, `X1`) and play scenarios (steps over time) without depending on Mermaid's internal DOM structure.

Published to [npm](https://www.npmjs.com/package/mermaid-flow-player). Use via **CDN** with no install required, or `npm install mermaid-flow-player`.

## Quick start (CDN)

One script: CSS is bundled and injected by the library. Add Mermaid, then the flow player:

```html
<!-- 1. Mermaid -->
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>

<!-- 2. Flow player (auto mode: zero config, styles injected automatically) -->
<script type="module" src="https://cdn.jsdelivr.net/npm/mermaid-flow-player/auto.js"></script>
```

Every `.mermaid` diagram gets play controls automatically. Or use the API with the full library (one script, styles still injected):

```html
<script type="module">
  import { createFlowPlayer } from 'https://cdn.jsdelivr.net/npm/mermaid-flow-player/index.js';

  const player = createFlowPlayer({
    root: document.getElementById('diagram')
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
Automatically update narration text as animation progresses:

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

### Web Component
Drop-in `<mermaid-flow-player>` custom element. Diagram from inner text (or `diagram` attribute):

```html
<script src="https://cdn.jsdelivr.net/npm/mermaid-flow-player@latest/mermaid-flow-player.element.js"></script>

<mermaid-flow-player autoplay controls>
  graph LR; A-->B-->C
</mermaid-flow-player>
```

### Interactive Mode
Step-through with user-controlled path selection:

```ts
const player = createFlowPlayer({ root: diagram, mode: 'interactive' });
await player.nextStep();
```

### Auto Modes
Zero-config usage:

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

## License

MIT
