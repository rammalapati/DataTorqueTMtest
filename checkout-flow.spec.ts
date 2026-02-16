import { test } from '@playwright/test';
import { users } from '../../data/users';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test('Verify successful checkout flow for multiple items', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const checkout = new CheckoutPage(page);

  await login.goto();
  await login.login(users.standard.username, users.standard.password);

  // Select the first two items from the inventory
  await inventory.addFirstNItems(2);
  await inventory.openCart();

  // Complete the checkout process
  await page.locator('[data-test="checkout"]').click();
  await checkout.fillInfo('Rams', 'Automation', '12345');
  await checkout.finish();
});
