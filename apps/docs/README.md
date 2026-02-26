# Mermaid Flow Player — Documentation

Astro + [Starlight](https://starlight.astro.build) documentation site for **Mermaid Flow Player**. Deployed to GitHub Pages from this repo.

## Project structure

```text
apps/docs/
├── public/           # Static assets; local-dist/ holds copied player build for demos
├── src/
│   ├── content/
│   │   └── docs/     # MDX docs (installation, features, API, diagram types, etc.)
│   ├── components/
│   └── ...
├── scripts/          # copy-player.mjs — copies built player from -src for local dev
├── astro.config.mjs
└── package.json
```

The library source lives in the private repo **mermaid-flow-player-src**. You can use the player from **local** build (symlink) or **CDN** via `.env`.

### Local vs CDN

- **Local:** Symlink the -src build so docs serve it from `/local-dist/`. From `apps/docs`: run `pnpm link-player` (requires `mermaid-flow-player-src` built and cloned alongside this repo). This creates `public/local-dist` → `../mermaid-flow-player-src/packages/mermaid-flow-player` and, if missing, a `.env` with `PUBLIC_FLOW_PLAYER_BASE=/local-dist`.
- **CDN:** Omit `PUBLIC_FLOW_PLAYER_BASE` or set it to `https://cdn.jsdelivr.net/npm/mermaid-flow-player` in `.env`. See `.env.example`.

Build (and `copy-player`) will copy from -src when present; if `public/local-dist` is already a symlink, copy is skipped.

## Commands

From **repo root** (recommended):

| Command            | Action                                      |
| ------------------ | ------------------------------------------- |
| `pnpm dev`         | Start docs dev server (e.g. localhost:4321) |
| `pnpm build`       | Build docs to `apps/docs/dist/`             |
| `pnpm lint`        | Lint (root + workspace)                     |

From **apps/docs**:

| Command                | Action                                                           |
| ---------------------- | ---------------------------------------------------------------- |
| `pnpm install`         | Install dependencies                                             |
| `pnpm link-player`     | Symlink -src build to `public/local-dist` (local player source)   |
| `pnpm dev`             | Copy/link player (if needed) + start Astro dev server            |
| `pnpm build`           | Copy player (if needed) + `astro check` + build to `./dist/`     |
| `pnpm preview`         | Preview production build locally                                 |
| `pnpm test:e2e`        | Run Playwright e2e tests                                          |
| `pnpm astro ...`       | Astro CLI (e.g. `astro add`, `astro check`)                      |

## Learn more

- [Astro](https://docs.astro.build)
- [Starlight](https://starlight.astro.build)
