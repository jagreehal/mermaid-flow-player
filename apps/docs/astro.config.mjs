// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeNext from 'starlight-theme-next';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { getFlowPlayerBase } from './src/lib/flow-player-base.js';

const siteBase = process.env.BASE || '/mermaid-flow-player';
const flowPlayerBase = getFlowPlayerBase(siteBase);

// Same base path locally and on GitHub Pages (https://jagreehal.github.io/mermaid-flow-player/).
// Use BASE=/ for local dev at root: pnpm dev:root or BASE=/ pnpm dev
export default defineConfig({
  site: 'https://jagreehal.github.io',
  base: siteBase,
  integrations: [
    starlight({
      title: 'Mermaid Flow Player',
      description: 'Animate Mermaid diagrams with a semantic API',
      favicon: '/favicon.svg',
      customCss: ['./src/styles/global.css'],
      plugins: [starlightThemeNext()],
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      head: [
        // NB: no <base> tag. One used to live here to resolve the handful of
        // relative links on the homepage, but <base> also rebases `#fragment`
        // links — so every heading anchor and every "On this page" entry on
        // every page navigated back to the homepage instead of scrolling.
        // Starlight already emits its own links base-prefixed; author links
        // relative to the site root instead of relying on <base>.
        //
        // Mermaid, with auto-render OFF: the player owns rendering so the
        // diagram source (and its `%% narrate` script) survives long enough to
        // be read. Mermaid's default startOnLoad would replace the text with
        // SVG before any of it could be parsed.
        {
          tag: 'script',
          attrs: {
            src: 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js',
          },
        },
        {
          tag: 'script',
          content: `window.mermaid?.initialize({ startOnLoad: false });`,
        },
        // The player. Auto mode registers <mermaid-flow-player> and upgrades
        // every diagram block into one, so pages get the element's full
        // feature set (captions, chapters, voice, deep-links) without
        // authoring element markup by hand. Source is the published CDN build
        // unless PLAYER_BASE=local (see src/lib/flow-player-base.js).
        //
        // A classic script, not the ESM `auto.js`: that is what these docs tell
        // readers to use, and a docs site that loads something other than what
        // it teaches has not tested its own advice.
        //
        // The name here is `auto.min.js` while the docs teach the identical
        // `auto.global.js`. That is deliberate and temporary: this site pins
        // `@latest`, `auto.global.js` first ships in 1.1, and deploying this
        // branch before that release would 404 the player on every page.
        // `auto.min.js` ships in every 1.x, so it cannot break. Switch this
        // line once 1.1 is on npm.
        {
          tag: 'script',
          attrs: {
            src: `${flowPlayerBase}/auto.min.js`,
            // Opt in to JetBrains Mono. The player defaults to the system
            // monospace stack so it never adds third-party requests to a
            // consumer's page; this site is ours, so it takes the typography.
            'data-mfp-font': '',
          },
        },
      ],
      sidebar: [
        { label: 'Home', slug: 'index' },
        { label: 'Installation', slug: 'installation' },
        {
          label: 'Features',
          items: [
            { label: 'Overview', slug: 'features' },
            { label: 'Showcase', slug: 'features/showcase' },
            { label: 'Auto Modes', slug: 'features/auto-modes' },
            { label: 'Animations & Easing', slug: 'features/animations' },
            { label: 'Edge Detection', slug: 'features/edge-detection' },
            { label: 'Interactive Mode', slug: 'features/interactive' },
            { label: 'Event Hooks', slug: 'features/event-hooks' },
            { label: 'Narration', slug: 'features/narration' },
            { label: 'Scenario Builder', slug: 'features/builder-api' },
            { label: 'Plugin System', slug: 'features/plugins' },
            { label: 'Themes', slug: 'features/themes' },
            { label: 'Query Parameters', slug: 'features/query-params' },
          ],
        },
        {
          label: 'Diagram Types',
          items: [
            { label: 'Flowcharts', slug: 'diagram-types/flowcharts' },
            { label: 'Sequence', slug: 'diagram-types/sequence' },
            { label: 'State', slug: 'diagram-types/state' },
            { label: 'Gantt', slug: 'diagram-types/gantt' },
            { label: 'User Journey', slug: 'diagram-types/journey' },
            { label: 'Class', slug: 'diagram-types/class' },
            { label: 'ER', slug: 'diagram-types/er' },
          ],
        },
        { label: 'API Reference', slug: 'api/reference' },
        { label: 'CDN Builder', slug: 'cdn-builder' },
      ],
    }),
  ],
  vite: {
    resolve: {
      alias: {
        '~/components': fileURLToPath(new URL('./src/components', import.meta.url)),
      },
    },
    // @ts-expect-error Tailwind Vite plugin types target Vite 7; Astro uses Vite 6. Runtime compatible.
    plugins: [tailwindcss()],
  },
});
