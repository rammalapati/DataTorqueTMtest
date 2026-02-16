import { Page, expect } from '@playwright/test';
export class CheckoutPage {
  constructor(private page: Page) {}
  async fillInfo(fn: string, ln: string, zip: string) {
    await this.page.locator('[data-test="firstName"]').fill(fn);
    await this.page.locator('[data-test="lastName"]').fill(ln);
    await this.page.locator('[data-test="postalCode"]').fill(zip);
    await this.page.locator('[data-test="continue"]').click();
  }
  async finish() {
    await this.page.locator('[data-test="finish"]').click();
    await expect(this.page.locator('.complete-header')).toHaveText('Thank you for your order!');
  }
}
