import type { Locator, Page } from '@playwright/test';

export class AppShellPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  titleBar(): Locator {
    return this.page.getByRole('heading', { name: 'ESG Emissions Tracker' });
  }
}
