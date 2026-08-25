/**
 * Every player on the homepage has to fit its box on load, with no panning and
 * no press of Fit. Two separate things broke this, and both are easy to
 * reintroduce by editing a diagram or a column width:
 *
 *  - The job demos sit in a grid column that narrows after the players have
 *    already fitted, and the player only re-fitted on `window` resize. Fixed in
 *    the player with a ResizeObserver on its own container.
 *  - fitView() will not shrink past `minReadableScale` (0.6), preferring to
 *    overflow and pan rather than go illegible. So a diagram wider than
 *    `column / 0.6` overflows by design. Keep the demo diagrams under it.
 */
import { test, expect } from '@playwright/test';
import { story } from 'executable-stories-playwright';

test.describe('Homepage diagram fit', () => {
  test('every player fits its container on load', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'homepage', 'viewport'] });

    story.given('I load the homepage on a wide screen');
    await page.setViewportSize({ width: 2000, height: 1100 });
    await page.goto('');
    await page.waitForSelector('.mfp-controls', { timeout: 25_000 });
    await page.waitForTimeout(4000);

    story.then('no diagram is wider than the box holding it');
    const players = await page.evaluate(() => {
      const out: { rendered: number; available: number }[] = [];
      document.querySelectorAll('mermaid-flow-player').forEach((el) => {
        const svg = el.querySelector('svg');
        const viewport = svg?.parentElement?.parentElement as HTMLElement | null;
        if (!svg || !viewport) return;
        out.push({
          rendered: Math.round(svg.getBoundingClientRect().width),
          available: Math.round(viewport.clientWidth),
        });
      });
      return out;
    });

    expect(players.length).toBeGreaterThan(3);
    for (const p of players) {
      // One pixel of slack: clientWidth rounds, getBoundingClientRect does not.
      expect(p.rendered).toBeLessThanOrEqual(p.available + 1);
    }
  });
});
