import type { Page } from '@playwright/test';

export async function waitForDiagram(page: Page, selector = '.mermaid') {
  await page.waitForSelector(selector, { state: 'visible', timeout: 15000 });
  // Wait for Mermaid to render (CDN loading may take longer)
  await new Promise((r) => setTimeout(r, 2000));
}

export async function waitForControls(page: Page) {
  await page.waitForSelector('.mermaid-flow-controls', { state: 'visible', timeout: 20000 });
}

/**
 * Wait for either sequential controls (Play button) or interactive footer (Reset).
 * Use for pages where the first diagram may be interactive (e.g. state).
 */
export async function waitForControlsOrInteractive(page: Page) {
  await page.waitForSelector(
    '.mermaid-flow-controls, .mermaid-flow-interactive-footer',
    { state: 'visible', timeout: 20000 }
  );
}

/**
 * Assert that the diagram has rendered (SVG present). Use for diagram types
 * that do not get controls (gantt, journey).
 */
export async function expectDiagramRendered(page: Page) {
  const svg = page.locator('.mermaid svg').first();
  await svg.waitFor({ state: 'visible', timeout: 15000 });
}

export async function getButtonStyles(page: Page, buttonText: string) {
  const button = page.locator('.mermaid-flow-controls button', { hasText: buttonText });
  return {
    background: await button.evaluate(el => getComputedStyle(el).background),
    backgroundImage: await button.evaluate(el => getComputedStyle(el).backgroundImage),
    border: await button.evaluate(el => getComputedStyle(el).border),
    borderRadius: await button.evaluate(el => getComputedStyle(el).borderRadius),
    inlineStyle: await button.getAttribute('style'),
  };
}
