import { test, expect } from '@playwright/test';
import { story } from 'executable-stories-playwright';
import { waitForDiagram, waitForControls } from './helpers';

test.describe('Button Styling', () => {
  test('control buttons render from CDN', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'styling', 'controls'] });

    story.given('I am on the auto-modes page with diagram and controls');
    await page.goto('/features/auto-modes');
    await waitForDiagram(page);
    await waitForControls(page);

    const playButton = page.locator('.mermaid-flow-controls button').first();

    story.then('the first button should be visible');
    await expect(playButton).toBeVisible();

    story.and('it should have background color and border radius set');
    const bg = await playButton.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).toBeTruthy();
    const borderRadius = await playButton.evaluate(el => getComputedStyle(el).borderRadius);
    expect(borderRadius).toBeTruthy();
  });

  test('hover effects work', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'styling', 'hover'] });

    story.given('I am on the auto-modes page with controls');
    await page.goto('/features/auto-modes');
    await waitForControls(page);

    const playButton = page.locator('.mermaid-flow-controls button').first();
    const initialBg = await playButton.evaluate(el => getComputedStyle(el).backgroundColor);

    story.when('I hover over the first control button');
    await playButton.hover();
    await page.waitForTimeout(200);

    story.then('the background color should change');
    const hoverBg = await playButton.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(hoverBg).not.toBe(initialBg);
  });

  test('all control buttons render', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'styling', 'controls'] });

    story.given('I am on the auto-modes page with controls');
    await page.goto('/features/auto-modes');
    await waitForControls(page);

    story.then('Play, Back to Start, Previous, and Next buttons should be visible');
    const buttons = ['Play', 'Back to Start', 'Previous', 'Next'];
    for (const buttonText of buttons) {
      const button = page.locator('.mermaid-flow-controls button', { hasText: buttonText }).first();
      await expect(button).toBeVisible();
    }
  });
});
