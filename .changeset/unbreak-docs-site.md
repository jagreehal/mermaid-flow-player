---
'docs': patch
---

Fix the landing page, in-page links, and diagram sizing on the docs site.

- Removed the `<base href="/mermaid-flow-player/">` tag. It rebased `#fragment`
  links too, so every heading anchor and every "On this page" entry navigated
  back to the homepage instead of scrolling. The ~70 markdown links that relied
  on it were written site-root-relative and are now genuinely relative, so they
  resolve under any base including `BASE=/` local dev.
- Capped prose at 72ch instead of the whole content column. The column cap
  squeezed every diagram, code block and grid, and left the splash homepage as a
  narrow strip pinned to the left of a 1080px container.
- Sized the showcase grid and theme gallery off the available width rather than
  a viewport media query. A 1280px laptop was cutting the ~650px content column
  into 300px cells, overflowing every diagram in the showcase.
- Fixed the Event Hooks demo: it rendered nothing until Play was pressed, and
  tagged its own container `.mermaid`, which `auto.js` then replaced with a
  second player competing with the one the demo had just built.
- Pointed the Playwright `baseURL` at the port and base path `pnpm dev` actually
  serves, and excluded generated and symlinked directories under `apps/docs`
  from `astro check` so `pnpm build` survives `pnpm link-player`.
- Removed stray scratch files committed into `apps/docs`, and dropped a stale
  `ignore` entry that made every changesets command fail.
