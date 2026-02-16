import { Page, expect } from '@playwright/test';
export class InventoryPage {
  constructor(private page: Page) {}
  async addFirstNItems(n: number) {
    const names: string[] = [];
    const items = this.page.locator('.inventory_item');
    for (let i = 0; i < n; i++) {
      const item = items.nth(i);
      names.push(await item.locator('.inventory_item_name').innerText());
      await item.getByRole('button', { name: 'Add to cart' }).click();
    }
    return names;
  }
  async openCart() { await this.page.locator('.shopping_cart_link').click(); }
}
