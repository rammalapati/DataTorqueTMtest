# Swag Labs E2E Automation Framework
This repository contains an end-to-end automation framework for the **Swag Labs** demo application, built with **Playwright** and **TypeScript**, following a clean **Page Object Model (POM)** architecture.

The primary automated scenario is the **checkout flow for the first two inventory items**, with support for multiple Swag Labs user personas.

---

## Tech Stack

- **Language:** TypeScript  
- **Test Runner:** Playwright Test  
- **Pattern:** Page Object Model (POM)  
- **Browser:** Chromium (via Playwright projects)  
- **Platform:** macOS (framework is OS-agnostic and CI/CD friendly)

---

## 📁 Project Structure

```text
src/
  pages/          # Page Object classes, UI actions, and assertions
    LoginPage.ts
    InventoryPage.ts
    CartPage.ts
    CheckoutPage.ts
    OrderCompletePage.ts

  data/           # Test data and user personas
    users.ts
    testData.ts

  utils/          # Reusable helper utilities
    randomHelper.ts
    dateHelper.ts
    stringHelper.ts

tests/
  e2e/
    checkout.spec.ts    # Main checkout regression scenario

playwright.config.ts    # Playwright configuration
tsconfig.json           # TypeScript configuration
package.json            # NPM scripts and dependencies
README.md
🚀 Getting Started
Prerequisites
Node.js (v18 or higher)
npm
Clone the Repository
bash
Copy
git clone https://github.com/rammalapati/DataTorqueTMtest.git
cd DataTorqueTMtest
git checkout test-automation-framework
Install Dependencies
bash
Copy
npm install
Install Playwright Browsers
bash
Copy
npx playwright install chromium
🧪 Running Tests
Run All Tests (Headless)
bash
Copy
npx playwright test
Run All Tests in Headed Mode (Browser UI Visible)
bash
Copy
npx playwright test --headed
Run a Specific Test File
bash
Copy
npx playwright test tests/e2e/checkout.spec.ts
npx playwright test tests/e2e/checkout.spec.ts --headed
📊 Viewing Test Reports
Generate & Open the HTML Report
After any test run:

bash
Copy
npx playwright show-report
This opens Playwright’s HTML report in your default browser, including:

Test results by file and test name
Screenshots (on failure)
Traces (on retry, if configured)
Console logs and network information
👥 User Personas & Environment Variables
Swag Labs provides multiple predefined users that simulate different behaviours.
The framework centralizes these in src/data/users.ts and supports them via environment variables.

Defined personas:

standard_user – Normal, stable user (default happy path)
problem_user – UI / functional issues (used to expose bugs)
performance_glitch_user – Intentionally slower responses (latency)
locked_out_user – Login is blocked
Default Behaviour (Standard User)
If you simply run:

bash
Copy
npx playwright test --headed
the framework uses standard_user by default via:

ts
Copy
username: process.env.SWAG_USERNAME || 'standard_user';
Running with a Specific Persona
You can override the user at runtime by setting SWAG_USERNAME:

bash
Copy
SWAG_USERNAME=standard_user            npx playwright test --headed
SWAG_USERNAME=problem_user            npx playwright test --headed
SWAG_USERNAME=performance_glitch_user npx playwright test --headed
SWAG_USERNAME=locked_out_user         npx playwright test --headed
The checkout regression test is designed as a happy-path scenario.
When executed with known “buggy” personas (e.g. problem_user, locked_out_user),
the test surfaces clear, persona-aware error messages explaining why the flow did not complete
(for example, form validation errors on the checkout page such as “Error: Last Name is required”).

🏗 Page Object Model Overview
Each Page Object:

Encapsulates locators as private fields
Exposes high-level actions for tests (e.g. login, addFirstNItems, proceedToCheckout)
Performs targeted assertions close to the UI, improving reuse and readability
Key Pages
LoginPage (src/pages/LoginPage.ts)
goto() – Navigate to the Swag Labs login page
login(username, password) – Perform login and assert navigation to the inventory page
InventoryPage (src/pages/InventoryPage.ts)
addFirstNItems(count: number): Promise<string[]> – Adds the first N items and returns their names
openCart() – Navigates to the cart page
CartPage (src/pages/CartPage.ts)
verifyItemsInCart(expectedItems: string[]) – Asserts that cart contents match expected items
proceedToCheckout() – Clicks the checkout button and asserts navigation to checkout step one
CheckoutPage (src/pages/CheckoutPage.ts)
fillCustomerInfo(firstName, lastName, zipCode) – Completes the customer info form and validates navigation to checkout step two, surfacing validation errors if the form fails
completeOrder() – Clicks finish and asserts navigation to the completion page
OrderCompletePage (src/pages/OrderCompletePage.ts)
verifyOrderComplete() – Verifies the “Thank you for your order!” confirmation
🔁 Main Regression Scenario
tests/e2e/checkout.spec.ts models the main business flow:

Navigate to Swag Labs
Log in using the selected persona (default: standard_user)
Add the first two inventory items to the cart
Verify the selected items in the cart
Proceed through checkout (step one → step two)
Complete the order
Verify the success message: “Thank you for your order!”
The test is persona-aware:

For stable personas (e.g. standard_user, performance_glitch_user),
failures indicate genuine regressions.
For known “buggy” personas (e.g. problem_user, locked_out_user),
failures are wrapped with clear context explaining that this is expected behaviour for that user type, and the application’s own error messages are surfaced.
🧩 Utility Helpers
Located under src/utils/:

RandomHelper
Generates random numbers and ZIP codes
Picks random elements from arrays
Used to provide dynamic data (e.g. random ZIP code during checkout)
DateHelper
Provides basic date formatting and date arithmetic helpers
Ready for future scenarios involving delivery dates, order history, etc.
StringHelper
Generates random strings and emails
Provides simple capitalization helpers
Useful for sign-up or profile-editing scenarios when unique values are needed
These helpers avoid duplication and prepare the framework for additional tests without changing the core structure.

🔍 Design Considerations
Maintainability
Clear separation of pages, data, and utils makes it easy to grow the suite.
Locators are confined to Page Objects, so UI changes require minimal updates.
Resilience
Uses semantic locators (e.g. data-test attributes) and Playwright’s built-in auto-waiting.
Checkout page includes defensive logic to surface validation errors when navigation fails.
Scalability
Current scope covers the checkout flow; the architecture can easily accommodate additional flows (sorting, filtering, negative tests, etc.).
CI/CD Ready
Personas and credentials can be injected via environment variables (SWAG_USERNAME, SWAG_PASSWORD), making this framework easy to integrate into CI pipelines.