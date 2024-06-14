import { test } from '@affine-test/kit/playwright';
import { openHomePage } from '@affine-test/kit/utils/load-page';
import {
  clickNewPageButton,
  getBlockSuiteEditorTitle,
  getPageOperationButton,
  waitForEditorLoad,
} from '@affine-test/kit/utils/page-logic';
import { expect } from '@playwright/test';

test('click btn bew page and open in tab', async ({ page, workspace }) => {
  await openHomePage(page);
  await waitForEditorLoad(page);
  await clickNewPageButton(page);
  await getBlockSuiteEditorTitle(page).click();
  await getBlockSuiteEditorTitle(page).fill('this is a new page');
  const newPageUrl = page.url();
  const newPageId = page.url().split('/').reverse()[0];

  await page.getByTestId('all-pages').click();

  await getPageOperationButton(page, newPageId).click();
  const [newTabPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('menuitem', { name: 'Open in new tab' }).click(),
  ]);

  expect(newTabPage.url()).toBe(newPageUrl);
  const currentWorkspace = await workspace.current();

  expect(currentWorkspace.meta.flavour).toContain('local');
});
