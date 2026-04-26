/**
 * Base URL for Flow Player assets. No trailing slash.
 * Always uses CDN for docs.
 */
export function getFlowPlayerBase(siteBase) {
  void siteBase;
  return 'https://cdn.jsdelivr.net/npm/mermaid-flow-player@latest';
}
