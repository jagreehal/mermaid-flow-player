#!/usr/bin/env node
/**
 * Docs and skills consistency, offline.
 *
 * This exists because a page was deleted and the links to it were not, and
 * because a skill went on advertising an attribute the library had dropped.
 * Both are the same failure: a claim outliving the thing it described. Nothing
 * here needs the library — it only checks that this repo agrees with itself.
 *
 * The attribute claims are checked separately, against the real element, in
 * tests/e2e/skill-attributes.spec.ts.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const docsRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(docsRoot, '..', '..');
const contentDir = join(docsRoot, 'src', 'content', 'docs');
const skillsDir = join(repoRoot, 'skills');

const problems = [];
const fail = (file, message) => problems.push(`${file}: ${message}`);

const walk = (dir, ext) => {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(path, ext));
    else if (entry.name.endsWith(ext)) out.push(path);
  }
  return out;
};

const rel = (path) => path.slice(repoRoot.length + 1);

// --- The pages that exist, by the slug a link would use -------------------
/** The URL a page is served at: `features/index.mdx` is `/features/`. */
const slugOf = (path) =>
  path
    .slice(contentDir.length + 1)
    .replace(/\.mdx$/, '')
    .replace(/(^|\/)index$/, '');

const pages = new Set(walk(contentDir, '.mdx').map(slugOf));

// --- Internal links resolve ------------------------------------------------
// A link inside a fenced block is an example, not a link. Blanking the fences
// keeps offsets and line breaks intact while taking their contents out of play.
const withoutCode = (text) => text.replace(/```[\s\S]*?```/g, (block) => block.replace(/[^\n]/g, ' '));

// Starlight serves each page as a directory, so a relative link resolves
// against `/slug/` — `../narration/` from `features/event-hooks` is
// `features/narration`, not `narration`.
const LINK = /\]\((?<href>\.[^)#\s]*?)\/?(?:#[^)]*)?\)/g;
for (const path of walk(contentDir, '.mdx')) {
  const from = slugOf(path);
  for (const { groups } of withoutCode(readFileSync(path, 'utf8')).matchAll(LINK)) {
    const target = resolve('/' + from + '/', groups.href).slice(1);
    if (!pages.has(target)) {
      fail(rel(path), `links to "${groups.href}", and there is no page "${target || 'index'}"`);
    }
  }
}

// --- Every sidebar entry points at a page that exists ----------------------
const config = readFileSync(join(docsRoot, 'astro.config.mjs'), 'utf8');
for (const [, slug] of config.matchAll(/slug: '([^']+)'/g)) {
  if (!pages.has(slug === 'index' ? '' : slug)) {
    fail('apps/docs/astro.config.mjs', `sidebar lists "${slug}", and there is no such page`);
  }
}

// --- Every page is reachable from the sidebar ------------------------------
const listed = new Set(
  [...config.matchAll(/slug: '([^']+)'/g)].map(([, slug]) => (slug === 'index' ? '' : slug)),
);
for (const page of pages) {
  if (!listed.has(page)) fail('apps/docs/astro.config.mjs', `nothing in the sidebar reaches "${page || 'index'}"`);
}

// --- Skills ---------------------------------------------------------------
if (existsSync(skillsDir)) {
  const skills = readdirSync(skillsDir).filter((name) =>
    statSync(join(skillsDir, name)).isDirectory(),
  );
  const known = new Set(skills);

  for (const skill of skills) {
    const path = join(skillsDir, skill, 'SKILL.md');
    if (!existsSync(path)) {
      fail(`skills/${skill}`, 'has no SKILL.md');
      continue;
    }
    const text = readFileSync(path, 'utf8');
    const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(text);
    if (!frontmatter) {
      fail(rel(path), 'has no frontmatter');
      continue;
    }
    const name = /^name: (\S+)$/m.exec(frontmatter[1]);
    if (!name) fail(rel(path), 'frontmatter has no name');
    else if (name[1] !== skill) fail(rel(path), `is named "${name[1]}" but lives in "${skill}"`);
    if (!/^description: /m.test(frontmatter[1])) fail(rel(path), 'frontmatter has no description');

    // A skill that points at a sibling has to point at one that exists: those
    // cross-references are how an agent picks the right skill.
    for (const [, referenced] of text.matchAll(/\b(mermaid-flow-player-[a-z-]+)\b/g)) {
      if (referenced !== skill && !known.has(referenced)) {
        fail(rel(path), `refers to skill "${referenced}", which does not exist`);
      }
    }
  }
}

if (problems.length > 0) {
  console.error(`check-docs: ${problems.length} problem(s)\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}
console.error(`check-docs: ${pages.size} pages and ${existsSync(skillsDir) ? readdirSync(skillsDir).length : 0} skills agree with each other.`);
