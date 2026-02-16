import { Page, expect } from '@playwright/test';
export class LoginPage {
  constructor(private page: Page) {}
  async goto() { await this.page.goto('/'); }
  async login(user: string, pass: string) {
    await this.page.locator('[data-test="username"]').fill(user);
    await this.page.locator('[data-test="password"]').fill(pass);
    await this.page.locator('[data-test="login-button"]').click();
    await expect(this.page).toHaveURL(/inventory/);
  }
}
