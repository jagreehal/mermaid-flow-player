import { test, expect } from '@playwright/test';
import { story } from 'executable-stories-playwright';
import { waitForDiagram, waitForControls } from './helpers';

test.describe('Animations', () => {
  test('play button starts animation', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'animations', 'play'] });

    story.given('I am on the auto-modes page with a diagram and controls');
    await page.goto('/features/auto-modes');
    await waitForDiagram(page);
    await waitForControls(page);

    const playButton = page.locator('.mermaid-flow-controls button', { hasText: 'Play' }).first();
    const diagram = page.locator('.mermaid').first();

    story.when('I click the Play button');
    await playButton.click();
    await page.waitForTimeout(500);

    story.then('an active node should be visible');
    const activeNode = diagram.locator('.mf-state-active');
    await expect(activeNode).toBeVisible({ timeout: 5000 });
  });

  test('pause button pauses animation', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'animations', 'pause'] });

    story.given('I am on the auto-modes page with controls');
    await page.goto('/features/auto-modes');
    await waitForControls(page);

    const playPauseButton = page.locator('.mermaid-flow-controls button', { hasText: 'Play' }).first();

    story.when('I start the animation then click Pause');
    await playPauseButton.click();
    const pauseButton = page.locator('.mermaid-flow-controls button', { hasText: 'Pause' }).first();
    await expect(pauseButton).toBeVisible({ timeout: 10000 });
    await pauseButton.click();

    story.then('the Play button should be visible again');
    await expect(playPauseButton).toBeVisible({ timeout: 3000 });
  });

  test('reset button clears animation state', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'animations', 'reset'] });

    story.given('I am on the auto-modes page with controls');
    await page.goto('/features/auto-modes');
    await waitForControls(page);

    const playButton = page.locator('.mermaid-flow-controls button', { hasText: 'Play' }).first();
    const resetButton = page.getByRole('button', { name: 'Back to start' }).first();
    const diagram = page.locator('.mermaid').first();

    story.when('I play then click Back to start');
    await playButton.click();
    await page.waitForTimeout(1000);
    await resetButton.click();

    story.then('no node should have the active class');
    const activeNodes = diagram.locator('.mf-state-active');
    await expect(activeNodes).toHaveCount(0);
  });
});
