/**
 * Every `<mermaid-flow-player>` attribute this repo teaches has to be one the
 * element actually observes.
 *
 * The library is not a dependency here, so the only honest source of truth is
 * the element the site itself loads. This asks it directly, which is why the
 * check cannot drift: there is no list to keep in step.
 *
 * It exists because `edge` was removed from the library and went on being
 * documented — in a table, in examples, and in a skill's own description.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

const docsRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const repoRoot = join(docsRoot, '..', '..');

/** Attributes the element does not observe but that HTML gives every tag. */
const UNIVERSAL = new Set(['id', 'class', 'style', 'title', 'hidden', 'slot', 'diagram']);

/**
 * Attributes this repo teaches that the *published* element reads once at
 * connect without observing. They work as documented; they just do nothing when
 * changed afterwards.
 *
 * Each entry is a promise to delete itself: the test fails if the published
 * element starts observing one, so the exception cannot outlive its reason.
 */
const READ_ONCE: Record<string, string> = {
  step: 'observed from 1.1; the published 1.0.x reads it only at connect',
};

const walk = (dir: string, ext: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path, ext);
    return entry.name.endsWith(ext) ? [path] : [];
  });

/** Every attribute written on a `<mermaid-flow-player ...>` tag in this repo. */
function documentedAttributes(): Map<string, string[]> {
  const files = [
    ...walk(join(docsRoot, 'src', 'content', 'docs'), '.mdx'),
    ...readdirSync(join(repoRoot, 'skills'))
      .filter((name) => statSync(join(repoRoot, 'skills', name)).isDirectory())
      .map((name) => join(repoRoot, 'skills', name, 'SKILL.md')),
  ];

  const found = new Map<string, string[]>();
  for (const path of files) {
    const text = readFileSync(path, 'utf8');
    const where = path.slice(repoRoot.length + 1);

    const note = (name: string) => {
      if (!UNIVERSAL.has(name)) found.set(name, [...(found.get(name) ?? []), where]);
    };

    // Attributes written on an opening tag. The value has to be consumed along
    // with the name, or the words inside `narration-text="Follow the decision
    // path"` read as four more attributes.
    for (const [, attrs] of text.matchAll(/<mermaid-flow-player\b([^>]*)>/g)) {
      for (const [, name] of attrs.matchAll(/([a-z][a-z-]*)(?:\s*=\s*"[^"]*")?/g)) {
        if (name) note(name);
      }
    }

    // Attributes listed in a table that says it lists attributes. Scoped to
    // that heading on purpose: every other table in these files holds easing
    // names, option names and prose, and a looser match reads those as
    // attributes the element has never heard of.
    let inAttributeTable = false;
    for (const line of text.split('\n')) {
      if (/^\|\s*Attribute\s*\|/i.test(line)) {
        inAttributeTable = true;
        continue;
      }
      if (inAttributeTable && !line.startsWith('|')) {
        inAttributeTable = false;
        continue;
      }
      if (!inAttributeTable) continue;
      const cell = /^\|\s*`([a-z][a-z-]*)(?:="[^"]*")?`/.exec(line);
      if (cell?.[1]) note(cell[1]);
    }
  }
  return found;
}

test('every attribute the docs and skills teach is one the element observes', async ({ page }) => {
  await page.goto('features/showcase');
  await page.waitForSelector('mermaid-flow-player', { timeout: 20_000 });

  const observed = await page.evaluate(async () => {
    await customElements.whenDefined('mermaid-flow-player');
    const ctor = customElements.get('mermaid-flow-player') as
      | (CustomElementConstructor & { observedAttributes?: string[] })
      | undefined;
    return ctor?.observedAttributes ?? null;
  });

  expect(observed, 'the element did not register, so nothing could be checked').not.toBeNull();
  expect(observed!.length).toBeGreaterThan(5);

  const known = new Set(observed!);

  const stale = Object.keys(READ_ONCE).filter((name) => known.has(name));
  expect(
    stale,
    'the published element observes these now, so delete their READ_ONCE entries',
  ).toEqual([]);

  const unknown = [...documentedAttributes()]
    .filter(([name]) => !known.has(name) && !(name in READ_ONCE))
    .map(([name, where]) => `${name} (in ${[...new Set(where)].join(', ')})`);

  expect(
    unknown,
    `documented but not known to the element. Observed: ${observed!.join(', ')}`,
  ).toEqual([]);
});
