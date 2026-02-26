#!/usr/bin/env node
/**
 * Copy mermaid-flow-player build into public/local-dist so the docs site
 * can serve the player from /local-dist/ (no npm publish required).
 * In this repo (docs-only) there is no package; optional copy from sibling
 * mermaid-flow-player-src repo if present.
 */
import { cpSync, mkdirSync, existsSync, readdirSync, lstatSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsRoot = join(__dirname, '..'); // apps/docs
const repoRoot = join(docsRoot, '..', '..'); // docs repo root (parent of apps/)
const target = join(docsRoot, 'public', 'local-dist');

// If already a symlink (from link-player), leave it
try {
  const stat = lstatSync(target);
  if (stat.isSymbolicLink()) {
    console.log('[docs] public/local-dist is a symlink, skipping copy.');
    process.exit(0);
  }
} catch {
  // target doesn't exist, continue
}

// Sibling -src repo: package build is at package root (no dist subdir)
const srcPackageRoot = join(repoRoot, '..', 'mermaid-flow-player-src', 'packages', 'mermaid-flow-player');
const hasSrcBuild = existsSync(join(srcPackageRoot, 'index.js'));

if (hasSrcBuild) {
  mkdirSync(target, { recursive: true });
  const files = readdirSync(srcPackageRoot);
  const built = files.filter(
    (f) =>
      f.endsWith('.js') ||
      f.endsWith('.cjs') ||
      f.endsWith('.css')
  );
  for (const f of built) {
    cpSync(join(srcPackageRoot, f), join(target, f));
  }
  console.log('[docs] Copied mermaid-flow-player build to public/local-dist');
} else {
  mkdirSync(target, { recursive: true });
  console.log(
    '[docs] No library build found (optional). For local player demos, build from mermaid-flow-player-src then run docs build again.'
  );
}
