import { test } from '@affine-test/kit/electron';
import { withCtrlOrMeta } from '@affine-test/kit/utils/keyboard';
import {
  clickNewPageButton,
  createLinkedPage,
  getBlockSuiteEditorTitle,
  waitForEmptyEditor,
} from '@affine-test/kit/utils/page-logic';
import {
  clickSideBarCurrentWorkspaceBanner,
  clickSideBarSettingButton,
} from '@affine-test/kit/utils/sidebar';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

const historyShortcut = async (page: Page, command: 'goBack' | 'goForward') => {
  await withCtrlOrMeta(page, () =>
    page.keyboard.press(command === 'goBack' ? '[' : ']', { delay: 50 })
  );
};

test('new page', async ({ page, workspace }) => {
  await page.getByTestId('sidebar-new-page-button').click();
  await page.waitForSelector('v-line');
  const flavour = (await workspace.current()).meta.flavour;
  expect(flavour).toBe('local');
});

test('app sidebar router forward/back', async ({ page }) => {
  {
    // create pages
    await page.waitForTimeout(500);
    await clickNewPageButton(page);
    await page.waitForSelector('v-line');
    const title = getBlockSuiteEditorTitle(page);
    await title.focus();
    await title.pressSequentially('test1', {
      delay: 100,
    });
    await page.waitForTimeout(500);
    await page.getByTestId('sidebar-new-page-button').click({
      delay: 100,
    });
    await page.waitForSelector('v-line');

    await title.focus();
    await title.pressSequentially('test2', {
      delay: 100,
    });
    await page.waitForTimeout(500);
    await page.getByTestId('sidebar-new-page-button').click({
      delay: 100,
    });
    await page.waitForSelector('v-line');
    await title.focus();
    await title.pressSequentially('test3', {
      delay: 100,
    });
  }
  {
    await expect(getBlockSuiteEditorTitle(page)).toHaveText('test3');
  }

  await page.click('[data-testid="app-navigation-button-back"]');
  await page.click('[data-testid="app-navigation-button-back"]');
  {
    await expect(getBlockSuiteEditorTitle(page)).toHaveText('test1');
  }
  await page.click('[data-testid="app-navigation-button-forward"]');
  await page.click('[data-testid="app-navigation-button-forward"]');
  {
    await expect(getBlockSuiteEditorTitle(page)).toHaveText('test3');
  }
  await historyShortcut(page, 'goBack');
  await historyShortcut(page, 'goBack');
  {
    await expect(getBlockSuiteEditorTitle(page)).toHaveText('test1');
  }
  await historyShortcut(page, 'goForward');
  await historyShortcut(page, 'goForward');
  {
    await expect(getBlockSuiteEditorTitle(page)).toHaveText('test3');
  }
});

test('clientBorder value should disable by default on window', async ({
  page,
}) => {
  await clickSideBarSettingButton(page);
  await page.waitForTimeout(1000);
  const settingItem = page.locator(
    '[data-testid="client-border-style-trigger"]'
  );
  expect(await settingItem.locator('input').inputValue()).toEqual(
    process.platform === 'win32' ? 'off' : 'on'
  );
});

test('app theme', async ({ page, electronApp }) => {
  const root = page.locator('html');
  {
    const themeMode = await root.evaluate(element => element.dataset.theme);
    expect(themeMode).toBe('light');

    const theme = await electronApp.evaluate(({ nativeTheme }) => {
      return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
    });

    expect(theme).toBe('light');
  }

  {
    await page.getByTestId('settings-modal-trigger').click();
    await page.getByTestId('appearance-panel-trigger').click();
    await page.waitForTimeout(50);
    await page.getByTestId('dark-theme-trigger').click();
    const themeMode = await root.evaluate(element => element.dataset.theme);
    expect(themeMode).toBe('dark');
    const theme = await electronApp.evaluate(({ nativeTheme }) => {
      return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
    });
    expect(theme).toBe('dark');
  }
});

test('windows only check', async ({ page }) => {
  const windowOnlyUI = page.locator('[data-platform-target=win32]');
  if (process.platform === 'win32') {
    await expect(windowOnlyUI.first()).toBeVisible();
  } else {
    await expect(windowOnlyUI.first()).not.toBeVisible();
  }
});

test('delete workspace', async ({ page }) => {
  await clickSideBarCurrentWorkspaceBanner(page);
  await page.getByTestId('new-workspace').click();
  await page.getByTestId('create-workspace-input').fill('Delete Me');
  await page.getByTestId('create-workspace-create-button').click();
  // await page.getByTestId('create-workspace-continue-button').click({
  //   delay: 100,
  // });
  await page.waitForTimeout(1000);
  await clickSideBarSettingButton(page);
  await page.getByTestId('current-workspace-label').click();
  await expect(page.getByTestId('workspace-name-input')).toHaveValue(
    'Delete Me'
  );
  const contentElement = page.getByTestId('setting-modal-content');
  const boundingBox = await contentElement.boundingBox();
  if (!boundingBox) {
    throw new Error('boundingBox is null');
  }
  await page.mouse.move(
    boundingBox.x + boundingBox.width / 2,
    boundingBox.y + boundingBox.height / 2
  );
  await page.mouse.wheel(0, 500);
  await page.getByTestId('delete-workspace-button').click();
  await page.getByTestId('delete-workspace-input').fill('Delete Me');
  await page.getByTestId('delete-workspace-confirm-button').click();
  await page.waitForTimeout(1000);
  expect(await page.getByTestId('workspace-name').textContent()).toBe(
    'Demo Workspace'
  );
});

// temporary way to enable split view
async function enableSplitView(page: Page) {
  await page.evaluate(() => {
    const settingKey = 'affine-settings';
    window.localStorage.setItem(
      settingKey,
      JSON.stringify({
        clientBorder: false,
        fullWidthLayout: false,
        windowFrameStyle: 'frameless',
        fontStyle: 'Serif',
        dateFormat: 'MM/dd/YYYY',
        startWeekOnMonday: false,
        enableBlurBackground: true,
        enableNoisyBackground: true,
        autoCheckUpdate: true,
        autoDownloadUpdate: true,
        enableMultiView: true,
        editorFlags: {},
      })
    );
  });
  await page.reload();
}

test('open split view', async ({ page }) => {
  await enableSplitView(page);
  await page.getByTestId('sidebar-new-page-button').click({
    delay: 100,
  });
  await waitForEmptyEditor(page);
  await page.waitForTimeout(500);
  await page.keyboard.press('Enter');
  await createLinkedPage(page, 'hi from another page');
  await page
    .locator('.affine-reference-title:has-text("hi from another page")')
    .click({
      modifiers: [process.platform === 'darwin' ? 'Meta' : 'Control'],
    });
  await expect(page.locator('.doc-title-container')).toHaveCount(2);
});
