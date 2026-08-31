import { test, expect } from '@playwright/test';

test('app shell renders the title bar', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('ESG Emissions Tracker')).toBeVisible();
});
