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
        // Ensure relative links resolve under base path (dev and production)
        {
          tag: 'base',
          attrs: {
            href: siteBase.replace(/\/?$/, '/'),
          },
        },
        // Mermaid CDN
        {
          tag: 'script',
          attrs: {
            src: 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js',
            defer: true,
          },
        },
        // Flow Player web component
        {
          tag: 'script',
          attrs: {
            src: 'https://cdn.jsdelivr.net/npm/mermaid-flow-player@latest/mermaid-flow-player.element.js',
            defer: true,
          },
        },
        // Flow Player autoInit for .mermaid elements
        {
          tag: 'script',
          attrs: { type: 'module' },
          content: `
            import { autoInit } from '${flowPlayerBase}/auto-init.js';
            document.addEventListener('DOMContentLoaded', () => {
              setTimeout(() => {
                autoInit({
                  selector: '.sl-markdown-content > .mermaid, .sl-markdown-content > pre.mermaid, .live-example > .mermaid, .live-example > pre.mermaid',
                });
              }, 1000);
            });
          `,
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
