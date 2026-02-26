import { test, expect } from '@playwright/test';
import { story } from 'executable-stories-playwright';
import {
  waitForDiagram,
  waitForControls,
  waitForControlsOrInteractive,
  expectDiagramRendered,
} from './helpers';

test.describe('Diagram Types', () => {
  test('flowchart diagrams render and animate', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'diagram-types', 'flowchart'] });

    story.given('I am on the flowcharts page');
    await page.goto('/diagram-types/flowcharts');
    await waitForDiagram(page);
    await waitForControls(page);

    story.when('I click Play');
    const playButton = page.locator('.mermaid-flow-controls button', { hasText: 'Play' }).first();
    await playButton.click();

    story.then('an active node should be visible');
    const activeNode = page.locator('.mf-state-active');
    await expect(activeNode).toBeVisible({ timeout: 5000 });
  });

  test('sequence diagrams render and animate', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'diagram-types', 'sequence'] });

    story.given('I am on the sequence diagrams page');
    await page.goto('/diagram-types/sequence');
    await waitForDiagram(page);
    await waitForControls(page);

    story.when('I click Play');
    const playButton = page.locator('.mermaid-flow-controls button', { hasText: 'Play' }).first();
    await playButton.click();

    story.then('an active node should be visible');
    const activeNode = page.locator('.mf-state-active');
    await expect(activeNode).toBeVisible({ timeout: 5000 });
  });

  test('state diagrams render', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'diagram-types', 'state'] });

    story.given('I am on the state diagrams page');
    await page.goto('/diagram-types/state');
    await waitForDiagram(page);
    // State page uses interactive mode (first diagram) — has Reset footer, not Play controls
    await waitForControlsOrInteractive(page);

    story.then('the diagram controls or interactive footer should be visible');
    const controlsOrFooter = page.locator(
      '.mermaid-flow-controls button, .mermaid-flow-interactive-footer'
    ).first();
    await expect(controlsOrFooter).toBeVisible();
  });

  test('gantt charts render', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'diagram-types', 'gantt'] });

    story.given('I am on the gantt page');
    await page.goto('/diagram-types/gantt');
    await waitForDiagram(page);
    // Gantt does not get Play controls by design — only assert diagram rendered
    await expectDiagramRendered(page);

    story.then('the diagram should be visible');
    const diagram = page.locator('.mermaid svg').first();
    await expect(diagram).toBeVisible();
  });

  test('user journey diagrams render', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'diagram-types', 'journey'] });

    story.given('I am on the user journey page');
    await page.goto('/diagram-types/journey');
    await waitForDiagram(page);
    // Journey does not get Play controls by design — only assert diagram rendered
    await expectDiagramRendered(page);

    story.then('the diagram should be visible');
    const diagram = page.locator('.mermaid svg').first();
    await expect(diagram).toBeVisible();
  });

  test('class diagrams render', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'diagram-types', 'class'] });

    story.given('I am on the class diagrams page');
    await page.goto('/diagram-types/class');
    await waitForDiagram(page);
    await waitForControls(page);

    story.then('the Play button should be visible');
    const playButton = page.locator('.mermaid-flow-controls button', { hasText: 'Play' }).first();
    await expect(playButton).toBeVisible();
  });

  test('ER diagrams render', async ({ page }, testInfo) => {
    story.init(testInfo, { tags: ['e2e', 'diagram-types', 'er'] });

    story.given('I am on the ER diagrams page');
    await page.goto('/diagram-types/er');
    await waitForDiagram(page);
    await waitForControls(page);

    story.then('the Play button should be visible');
    const playButton = page.locator('.mermaid-flow-controls button', { hasText: 'Play' }).first();
    await expect(playButton).toBeVisible();
  });
});
