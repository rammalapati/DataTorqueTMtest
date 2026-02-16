import { Page, expect } from '@playwright/test';

export class InventoryPage {
  private readonly inventoryItems = '.inventory_item';
  private readonly itemName = '.inventory_item_name';
  private readonly addToCartButton = 'button:has-text("Add to cart")';
  private readonly cartBadge = '.shopping_cart_badge';
  private readonly cartLink = '.shopping_cart_link';

  constructor(private page: Page) {}

  async addFirstNItems(count: number): Promise<string[]> {
    const itemNames: string[] = [];
    const items = this.page.locator(this.inventoryItems);

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const name = await item.locator(this.itemName).innerText();
      itemNames.push(name);
      await item.locator(this.addToCartButton).click();
    }

    await expect(this.page.locator(this.cartBadge)).toHaveText(String(count));
    return itemNames;
  }

  async openCart() {
    await this.page.locator(this.cartLink).click();
    await expect(this.page).toHaveURL(/cart/);
  }
}