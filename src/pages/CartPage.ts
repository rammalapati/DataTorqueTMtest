import { Page, expect } from '@playwright/test';

export class CartPage {
  private readonly cartItems = '.cart_item';
  private readonly itemName = '.inventory_item_name';
  private readonly checkoutButton = '[data-test="checkout"]';

  constructor(private page: Page) {}

  async verifyItemsInCart(expectedItems: string[]) {
    const cartItemNames = await this.page.locator(this.itemName).allInnerTexts();
    expect(cartItemNames).toEqual(expectedItems);
  }

  async proceedToCheckout() {
    await this.page.locator(this.checkoutButton).click();
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  async getCartItemCount(): Promise<number> {
    return await this.page.locator(this.cartItems).count();
  }
}