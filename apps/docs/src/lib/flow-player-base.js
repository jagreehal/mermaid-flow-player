/**
 * Base URL for Flow Player assets. No trailing slash.
 * - Set PUBLIC_FLOW_PLAYER_BASE in .env (see .env.example): /local-dist for local, or CDN URL.
 * - Unset: dev uses /local-dist, production always uses CDN (jsDelivr).
 * When base is a relative path (e.g. /local-dist), pass siteBase so it is prefixed
 * (e.g. /mermaid-flow-player/local-dist) for the dev server. In production we always use CDN.
 *
 * @param {string} [siteBase] - Site base path (e.g. /mermaid-flow-player). Required in config so relative player paths resolve correctly in dev.
 */
export function getFlowPlayerBase(siteBase) {
  const raw = import.meta.env.PUBLIC_FLOW_PLAYER_BASE;
  let base =
    raw != null && String(raw).trim() !== ''
      ? String(raw).replace(/\/$/, '')
      : import.meta.env.PROD
        ? 'https://cdn.jsdelivr.net/npm/mermaid-flow-player'
        : '/local-dist';

  // Production: always use CDN if we have a relative path (ignore /local-dist in prod)
  if (import.meta.env.PROD && base.startsWith('/') && !base.startsWith('//')) {
    base = 'https://cdn.jsdelivr.net/npm/mermaid-flow-player';
  }
  // Dev: relative path must include site base so Vite serves public/ under base
  else if (base.startsWith('/') && !base.startsWith('//')) {
    const prefix = (siteBase != null ? String(siteBase) : (import.meta.env.BASE || '/')).replace(/\/$/, '');
    base = prefix + base;
  }
  return base;
}
