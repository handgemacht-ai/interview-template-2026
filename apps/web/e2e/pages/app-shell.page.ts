import type { Locator, Page } from '@playwright/test';

export class AppShellPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  appBar(): Locator {
    return this.page.locator('header.MuiAppBar-root');
  }

  titleBar(): Locator {
    return this.appBar().getByText('ESG Emissions Tracker');
  }
}
