import { test } from '@playwright/test';
import { users } from '../../src/data/users';
import { checkoutData } from '../../src/data/testData';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { OrderCompletePage } from '../../src/pages/OrderCompletePage';
import { RandomHelper } from '../../src/utils/randomHelper';

test.describe('Checkout Flow - Regression Suite', () => {
  test('should successfully complete checkout with first two items', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const orderCompletePage = new OrderCompletePage(page);

    // Determine which persona we are running with
    const effectiveUsername = process.env.SWAG_USERNAME || users.standard.username;

    // Safety log to Playwright output
    console.log(`Running checkout regression as user: ${effectiveUsername}`);

    // Happy path is designed for standard_user.
    // If a known "bad" persona is used, we still run the test,
    // but if it fails, the error message will clearly indicate why.
    const isKnownBuggyPersona =
      effectiveUsername === users.problem.username ||
      effectiveUsername === users.lockedOut.username;

    // Login
    await loginPage.goto();
    await loginPage.login(effectiveUsername, users.standard.password);

    // Add first two items to cart
    const selectedItems = await inventoryPage.addFirstNItems(2);
    await inventoryPage.openCart();

    // Verify cart contents
    await cartPage.verifyItemsInCart(selectedItems);
    await cartPage.proceedToCheckout();

    // Complete checkout with dynamic zip code
    const randomZip = RandomHelper.getRandomZipCode();
    try {
      await checkoutPage.fillCustomerInfo(
        checkoutData.validCustomer.firstName,
        checkoutData.validCustomer.lastName,
        randomZip
      );
      await checkoutPage.completeOrder();
      await orderCompletePage.verifyOrderComplete();
    } catch (error: any) {
      if (isKnownBuggyPersona) {
        // Re-throw with a clearer context message
        throw new Error(
          `Happy-path checkout failed for known buggy persona "${effectiveUsername}". ` +
          `This is expected behaviour for this user type on Swag Labs.\n` +
          `Original error: ${error?.message ?? error}`
        );
      }
      // For standard or other users, just rethrow the original error
      throw error;
    }
  });
});