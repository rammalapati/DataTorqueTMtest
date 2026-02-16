import { Page, expect } from '@playwright/test';

export class LoginPage {
  private readonly usernameInput = '[data-test="username"]';
  private readonly passwordInput = '[data-test="password"]';
  private readonly loginButton = '[data-test="login-button"]';

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
    await expect(this.page.locator(this.usernameInput)).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.page.locator(this.usernameInput).fill(username);
    await this.page.locator(this.passwordInput).fill(password);
    await this.page.locator(this.loginButton).click();
    await expect(this.page).toHaveURL(/inventory/);
  }
}