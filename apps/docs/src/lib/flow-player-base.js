/**
 * Base URL for Flow Player assets. No trailing slash.
 *
 * Defaults to the published CDN build, so the deployed site tracks whatever is
 * on npm. Set `PLAYER_BASE=local` to serve the build in `public/local-dist`
 * instead — that is how you check unreleased player changes against the real
 * docs pages before publishing (run `pnpm --filter docs copy-player` first).
 */
export function getFlowPlayerBase(siteBase = process.env.BASE || '/mermaid-flow-player') {
  if (process.env.PLAYER_BASE === 'local') {
    return `${siteBase.replace(/\/$/, '')}/local-dist`;
  }
  return 'https://cdn.jsdelivr.net/npm/mermaid-flow-player@latest';
}
