import { test, expect } from '@playwright/test';
import { story } from 'executable-stories-playwright';

test.describe('CDN Builder', () => {
  test('tags each entry by its module format, not its filename', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'cdn-builder'] });

    // The builder used to decide `type="module"` by testing for a `.min.js`
    // suffix, so renaming the script-tag build to `auto.global.js` silently
    // started emitting a module tag for it — which will not load from file://.
    story.given('I am on the CDN Builder');
    await page.goto('cdn-builder');
    await page.waitForSelector('#html-snippet');

    story.when('I pick the script-tag build');
    await page.selectOption('#flow-entry', 'auto.global.js');
    await page.waitForTimeout(300);

    story.then('the snippet is a classic script');
    const classic = await page.locator('#html-snippet').inputValue();
    expect(classic).toContain('auto.global.js');
    expect(classic).not.toContain('type="module" src="https://cdn.jsdelivr.net/npm/mermaid-flow-player');

    story.when('I pick the ESM build instead');
    await page.selectOption('#flow-entry', 'auto.js');
    await page.waitForTimeout(300);

    story.then('the snippet carries type="module"');
    const esm = await page.locator('#html-snippet').inputValue();
    expect(esm).toContain('type="module"');
    expect(esm).toContain('auto.js');
  });
});
