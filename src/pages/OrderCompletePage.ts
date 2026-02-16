import { Page, expect } from '@playwright/test';

export class OrderCompletePage {
  private readonly completeHeader = '.complete-header';
  private readonly completeText = '.complete-text';

  constructor(private page: Page) {}

  async verifyOrderComplete() {
    await expect(this.page.locator(this.completeHeader)).toHaveText('Thank you for your order!');
    await expect(this.page.locator(this.completeText)).toBeVisible();
  }

  async getConfirmationMessage(): Promise<string> {
    return await this.page.locator(this.completeHeader).innerText();
  }
}