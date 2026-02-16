import { test } from '@playwright/test';
import { users } from '../../src/data/users';
import { checkoutData } from '../../src/data/testData';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { OrderCompletePage } from '../../src/pages/OrderCompletePage';
import { RandomHelper } from '../../src/utils/randomHelper';

// Configuration for the current test run
const effectiveUsername = process.env.SWAG_USERNAME || users.standard.username;

// Define personas that are known to have broken flows on the live site
const EXPECTED_FAILURE_PERSONAS = new Set([
  users.problem.username,
  users.lockedOut.username,
]);

// Toggle between fixed data for stability and random data for robustness
const USE_FUZZ_DATA = process.env.FUZZ_DATA === '1';

test.describe('Checkout Flow - Regression Suite', () => {
  
  // If running with a known buggy persona, mark the test as an expected failure.
  // This allows us to run the full suite without "false alarms" in the final report.
  test.fail(
    EXPECTED_FAILURE_PERSONAS.has(effectiveUsername),
    `This flow is expected to fail when using the "${effectiveUsername}" persona.`
  );

  test('should successfully complete checkout with first two items @smoke @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const orderCompletePage = new OrderCompletePage(page);

    console.log(`Running test as: ${effectiveUsername}`);
    console.log(`Data mode: ${USE_FUZZ_DATA ? 'Random' : 'Fixed'}`);

    // 1. Authentication
    await loginPage.goto();
    await loginPage.login(effectiveUsername, users.standard.password);

    // 2. Product Selection
    const selectedItems = await inventoryPage.addFirstNItems(2);
    await inventoryPage.openCart();

    // 3. Cart Validation
    await cartPage.verifyItemsInCart(selectedItems);
    await cartPage.proceedToCheckout();

    // 4. Checkout Information
    // Use a fixed ZIP code by default to ensure the test is deterministic in CI
    const zipCode = USE_FUZZ_DATA ? RandomHelper.getRandomZipCode() : '12345';

    await checkoutPage.fillCustomerInfo(
      checkoutData.validCustomer.firstName,
      checkoutData.validCustomer.lastName,
      zipCode
    );
    
    // 5. Order Finalization
    await checkoutPage.completeOrder();
    await orderCompletePage.verifyOrderComplete();
  });
});