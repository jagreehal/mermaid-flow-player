import { test, expect } from '@playwright/test';
import { story } from 'executable-stories-playwright';
import { waitForControls } from './helpers';

test.describe('Homepage playground', () => {
  test('the hero plays a diagram and hands over a runnable file', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'homepage', 'playground'] });

    story.given('I land on the homepage');
    await page.goto('');
    await waitForControls(page);

    story.then('a diagram is playing and the file to reproduce it is on the page');
    await expect(page.locator('#pg-stage .mermaid svg').first()).toBeVisible({
      timeout: 20_000,
    });
    const file = await page.locator('#pg-out').textContent();
    expect(file).toContain('<!doctype html>');
    expect(file).toContain('auto.global.js');
    expect(file).toContain('<div class="mermaid">');
    expect(file).toContain('Charge card');
  });

  test('pasting my own diagram renders it and updates the file', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'homepage', 'playground'] });

    story.given('I am on the homepage with the seeded diagram playing');
    await page.goto('');
    await waitForControls(page);
    await expect(page.locator('#pg-stage .mermaid svg').first()).toBeVisible({
      timeout: 20_000,
    });

    story.when('I replace the source with a diagram of my own');
    await page.locator('#pg-src').fill('flowchart LR\n  Alpha[Alpha] --> Beta[Beta]');

    story.then('the stage renders mine and the file carries it');
    await expect(page.locator('#pg-stage .mermaid').first()).toContainText('Alpha', { timeout: 20_000 });
    await expect(page.locator('#pg-out')).toContainText('Alpha[Alpha] --> Beta[Beta]');
    await expect(page.locator('#pg-note')).toHaveText('');
  });

  test('a diagram Mermaid cannot read leaves the last good one playing', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'homepage', 'playground', 'errors'] });

    story.given('I am on the homepage with a diagram of my own rendered');
    await page.goto('');
    await waitForControls(page);
    await page.locator('#pg-src').fill('flowchart LR\n  Alpha[Alpha] --> Beta[Beta]');
    await expect(page.locator('#pg-stage .mermaid').first()).toContainText('Alpha', { timeout: 20_000 });

    story.when('I paste something Mermaid rejects');
    await page.locator('#pg-src').fill('flowchart LR\n  Alpha -->');

    story.then('the hero keeps playing the last good diagram and says why');
    await expect(page.locator('#pg-note')).toContainText('last working version', {
      timeout: 15_000,
    });
    await expect(page.locator('#pg-stage .mermaid').first()).toContainText('Alpha');
    await expect(page.locator('#pg-out')).toContainText('Alpha[Alpha] --> Beta[Beta]');
  });
});
