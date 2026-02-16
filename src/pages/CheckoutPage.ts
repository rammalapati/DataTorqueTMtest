import { Page, expect } from '@playwright/test';

export class CheckoutPage {
  private readonly firstNameInput = '[data-test="firstName"]';
  private readonly lastNameInput = '[data-test="lastName"]';
  private readonly zipCodeInput = '[data-test="postalCode"]';
  private readonly continueButton = '[data-test="continue"]';
  private readonly finishButton = '[data-test="finish"]';
  private readonly errorMessage = '[data-test="error"]';

  constructor(private page: Page) {}

  async fillCustomerInfo(firstName: string, lastName: string, zipCode: string) {
    await this.page.locator(this.firstNameInput).fill(firstName);
    await this.page.locator(this.lastNameInput).fill(lastName);
    await this.page.locator(this.zipCodeInput).fill(zipCode);
    await this.page.locator(this.continueButton).click();

    // If we stayed on step one, try to surface any validation error
    if (this.page.url().includes('checkout-step-one')) {
      const errorVisible = await this.page.locator(this.errorMessage).isVisible();
      if (errorVisible) {
        const msg = await this.page.locator(this.errorMessage).innerText();
        throw new Error(
          `Checkout did not proceed to step two. Validation error on step one: "${msg}"`
        );
      }
    }

    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  async completeOrder() {
    await this.page.locator(this.finishButton).click();
    await expect(this.page).toHaveURL(/checkout-complete/);
  }
}