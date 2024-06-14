import { test } from '@affine-test/kit/playwright';
import { openHomePage } from '@affine-test/kit/utils/load-page';
import {
  clickNewPageButton,
  getBlockSuiteEditorTitle,
  waitForEditorLoad,
} from '@affine-test/kit/utils/page-logic';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

const addDatabase = async (page: Page) => {
  await page.keyboard.press('/', { delay: 500 });
  await page.keyboard.press('d', { delay: 500 });
  await page.keyboard.press('a', { delay: 500 });
  await page.keyboard.press('t', { delay: 500 });
  await page.keyboard.press('a', { delay: 500 });
  await page.getByTestId('Table View').click();
};

test('database is useable', async ({ page }) => {
  test.slow();
  await openHomePage(page);
  await waitForEditorLoad(page);
  await clickNewPageButton(page);
  const title = getBlockSuiteEditorTitle(page);
  await title.pressSequentially('test title');
  await page.keyboard.press('Enter');
  expect(await title.innerText()).toBe('test title');
  await addDatabase(page);
  const database = page.locator('affine-database');
  await expect(database).toBeVisible();
  await page.reload();
  await waitForEditorLoad(page);
  await clickNewPageButton(page);
  const title2 = getBlockSuiteEditorTitle(page);
  await title2.pressSequentially('test title2');
  await page.waitForTimeout(500);
  expect(await title2.innerText()).toBe('test title2');
  await page.keyboard.press('Enter');
  await addDatabase(page);
  const database2 = page.locator('affine-database');
  await expect(database2).toBeVisible();
});

test('link page is useable', async ({ page }) => {
  await openHomePage(page);
  await waitForEditorLoad(page);
  await clickNewPageButton(page);
  await waitForEditorLoad(page);
  const title = getBlockSuiteEditorTitle(page);
  await title.pressSequentially('page1');
  await page.keyboard.press('Enter');
  expect(await title.innerText()).toBe('page1');
  await clickNewPageButton(page);
  await waitForEditorLoad(page);
  const title2 = getBlockSuiteEditorTitle(page);
  await title2.pressSequentially('page2');
  await page.keyboard.press('Enter');
  expect(await title2.innerText()).toBe('page2');
  await page.keyboard.press('@', { delay: 50 });
  await page.keyboard.press('p');
  await page.keyboard.press('a');
  await page.keyboard.press('g');
  await page.keyboard.press('e');
  await page.keyboard.press('1');
  await page.keyboard.press('Enter');
  const link = page.locator('.affine-reference');
  await expect(link).toBeVisible();
  await page.click('.affine-reference');
  await page.waitForTimeout(500);

  await expect(
    page.locator('.doc-title-container:has-text("page1")')
  ).toBeVisible();
});
