import { test, expect } from '@playwright/test';
import { story } from 'executable-stories-playwright';

test.describe('Web Component E2E', () => {
  test('should render diagram with controls via custom element', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'web-component'] });

    story.given('I open the test web component page');
    await page.goto('/test-web-component.html');

    story.when('the custom element is defined and Mermaid has rendered');
    await page.waitForFunction(() => customElements.get('mermaid-flow-player'), {
      timeout: 10000,
    });
    await page.waitForSelector('mermaid-flow-player svg', { timeout: 30000 });

    story.then('the controls container should be visible');
    const controls = page.locator('mermaid-flow-player .mfp-controls');
    await expect(controls).toBeVisible({ timeout: 5000 });

    story.and('play-pause and restart buttons should be visible');
    const playBtn = controls.locator('button[data-action="play-pause"]');
    await expect(playBtn).toBeVisible();
    const resetBtn = controls.locator('button[data-action="restart"]');
    await expect(resetBtn).toBeVisible();
  });
});
