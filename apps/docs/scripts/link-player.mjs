#!/usr/bin/env node
/**
 * Create a symlink from apps/docs/public/local-dist to the built output of
 * mermaid-flow-player-src/packages/mermaid-flow-player so the docs site can
 * serve the player locally. Use with PUBLIC_FLOW_PLAYER_BASE=/local-dist in .env.
 */
import { symlinkSync, rmSync, existsSync, lstatSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsRoot = join(__dirname, '..'); // apps/docs
const repoRoot = join(docsRoot, '..', '..'); // docs repo root (parent of apps/)
const target = join(docsRoot, 'public', 'local-dist');

// Sibling -src repo: package build is at package root (no dist subdir)
const srcPackageRoot = resolve(repoRoot, '..', 'mermaid-flow-player-src', 'packages', 'mermaid-flow-player');

if (!existsSync(srcPackageRoot)) {
  console.error('[docs] mermaid-flow-player-src not found at:', srcPackageRoot);
  process.exit(1);
}

if (!existsSync(join(srcPackageRoot, 'index.js'))) {
  console.error('[docs] Build the library first: cd mermaid-flow-player-src && pnpm build');
  process.exit(1);
}

// Remove existing local-dist (directory or symlink) so we can create symlink
if (existsSync(target)) {
  const stat = lstatSync(target);
  if (stat.isSymbolicLink()) {
    rmSync(target);
  } else {
    rmSync(target, { recursive: true });
  }
}

symlinkSync(srcPackageRoot, target, 'dir');
console.log('[docs] Symlinked public/local-dist -> mermaid-flow-player-src/packages/mermaid-flow-player');

const envPath = join(docsRoot, '.env');
if (!existsSync(envPath)) {
  writeFileSync(envPath, 'PUBLIC_FLOW_PLAYER_BASE=/local-dist\n', 'utf8');
  console.log('       Created .env with PUBLIC_FLOW_PLAYER_BASE=/local-dist');
} else {
  console.log('       Set PUBLIC_FLOW_PLAYER_BASE=/local-dist in .env to use local build.');
}
