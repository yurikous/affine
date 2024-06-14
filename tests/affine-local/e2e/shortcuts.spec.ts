import { test } from '@affine-test/kit/playwright';
import { openHomePage } from '@affine-test/kit/utils/load-page';
import { waitForEditorLoad } from '@affine-test/kit/utils/page-logic';
import { expect } from '@playwright/test';

test('Open shortcuts modal', async ({ page }) => {
  await openHomePage(page);
  await waitForEditorLoad(page);
  await page.locator('[data-testid=help-island]').click();

  const shortcutsIcon = page.locator('[data-testid=shortcuts-icon]');
  await page.waitForTimeout(1000);
  await expect(shortcutsIcon).toBeVisible();

  await shortcutsIcon.click();
  await page.waitForTimeout(1000);

  const settingModal = page.getByTestId('setting-modal');
  await expect(settingModal).toBeVisible();

  const title = page.getByTestId('keyboard-shortcuts-title');
  await expect(title).toBeVisible();
});
