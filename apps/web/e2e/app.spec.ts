import { test, expect } from '@playwright/test';
import { AppShellPage } from './pages/app-shell.page';

test('app shell renders the title bar', async ({ page }) => {
  const shell = new AppShellPage(page);
  await shell.goto();
  await expect(shell.titleBar()).toBeVisible();
});
