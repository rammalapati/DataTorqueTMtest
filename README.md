#Swag Labs E2E Automation Framework

This repository contains an end-to-end automation framework for the **Swag Labs** demo application, built with **Playwright** and **TypeScript**, using a **Page Object Model (POM)** design.

The primary automated scenario is the **checkout flow for the first two inventory items**, with support for multiple Swag Labs user personas and a clear test strategy (smoke, regression, persona-based runs).

---

## 🔧 Tech Stack

- **Language:** TypeScript  
- **Test Runner:** Playwright Test  
- **Pattern:** Page Object Model (POM)  
- **Browser:** Chromium (via Playwright projects)  
- **Platform:** macOS (framework is OS-agnostic and CI/CD friendly)

---

## 🎯 Test Strategy

The framework is designed to support different levels of feedback and coverage:

### Execution Tiers

- **`@smoke`**  
  Critical happy-path scenarios that must pass for every code change.  
  Fast, deterministic, and suitable for PR validation.

- **`@regression`**  
  Broader end-to-end coverage that validates business flows in more depth.  
  Suitable for nightly or pre-release runs.

- **`@persona`** (planned)  
  Diagnostic runs using specific Swag Labs personas to observe how the system behaves under different user profiles (e.g., locked-out, glitchy, etc.).  
  These tests focus on observability and error reporting rather than being strict pass/fail gates.

### Deterministic vs. Random Data

By default, tests use **fixed data** (for example, a constant ZIP code) to keep runs stable and reproducible.

- Fixed data is used in normal runs and CI (reduces flakiness).
- Optional **Fuzz Mode** can be enabled via an environment variable to generate random ZIP codes and exercise the system with varied inputs:

```bash
FUZZ_DATA=1 npx playwright test
Handling Known-Buggy Personas
Some Swag Labs personas (such as problem_user and locked_out_user) are intentionally broken for testing purposes.
The framework marks these as expected to fail using Playwright’s test.fail() when they are used in the happy-path checkout test.

This allows:

Flexible use of all personas.
Clear reports that distinguish between:
Failures we already expect for a given persona, and
New regressions that need investigation.
📁 Project Structure
text
Copy
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
.env.example            # Example environment configuration
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
⚙️ Environment Configuration
Configuration is handled via environment variables.
An example file is provided as .env.example.

Key variables:

SWAG_USERNAME – controls which Swag Labs persona is used
FUZZ_DATA – toggles random data generation for checkout fields
CI – set automatically in CI systems
You can copy .env.example to .env (for local use) and update the values as needed.
Note: .env should not be committed to version control.

👥 User Personas
Swag Labs exposes multiple personas to simulate different behaviours.
These are defined centrally in src/data/users.ts and can be selected through the SWAG_USERNAME variable.

Common personas:

standard_user – Normal, stable user (default happy path)
problem_user – UI or functional issues to expose edge cases
performance_glitch_user – Slow responses to test wait strategies
locked_out_user – Login is blocked to test error handling
Default Behaviour (Standard User)
If you simply run:

bash
Copy
npx playwright test --headed
the framework uses standard_user by default:

ts
Copy
const effectiveUsername = process.env.SWAG_USERNAME || users.standard.username;
Running with a Specific Persona
You can override the user at runtime:

bash
Copy
SWAG_USERNAME=standard_user            npx playwright test --headed
SWAG_USERNAME=problem_user            npx playwright test --headed
SWAG_USERNAME=performance_glitch_user npx playwright test --headed
SWAG_USERNAME=locked_out_user         npx playwright test --headed
When using personas that are known to be broken in Swag Labs, the framework marks the checkout test as an expected failure and surfaces clear error messages from the application (for example, “Error: Last Name is required” during checkout).

🧪 Running Tests
The project defines several npm scripts to make test execution easier.

All Tests (default configuration)
bash
Copy
npm test
# or
npx playwright test
Smoke Tests Only
Runs tests tagged as @smoke (critical paths):

bash
Copy
npm run test:smoke
Regression Tests
Runs tests tagged as @regression:

bash
Copy
npm run test:regression
Headed Mode (browser UI visible)
bash
Copy
npm run test:headed
Debug Mode (Playwright Inspector)
bash
Copy
npm run test:debug
Persona-Focused Run (example)
bash
Copy
npm run test:persona
# By default this script runs with SWAG_USERNAME=problem_user and @persona tags (if added)
You can also target the checkout spec directly:

bash
Copy
npx playwright test tests/e2e/checkout.spec.ts
npx playwright test tests/e2e/checkout.spec.ts --headed
📊 Viewing Test Reports
HTML Report
Playwright’s HTML report can be opened after a test run:

bash
Copy
npm run test:report
# or
npx playwright show-report
The report includes:

Test results by file and test case
Screenshots on failure
Traces (on retry, as configured in playwright.config.ts)
Console logs and network information
In CI, an additional JSON report is generated (test-results/results.json) that can be used for dashboards or trend tracking.

🏗 Page Object Model Overview
Page Objects are used to keep locators and UI-specific logic in one place.

Each Page Object:

Holds locators as private fields
Provides clear, high-level methods (e.g. login, addFirstNItems, proceedToCheckout)
Encapsulates UI assertions close to where the actions occur
Key Pages
LoginPage (src/pages/LoginPage.ts)
goto() – Navigate to the login page
login(username, password) – Perform login and verify navigation to the inventory page
InventoryPage (src/pages/InventoryPage.ts)
addFirstNItems(count: number) – Adds the first N inventory items and returns their names
openCart() – Opens the cart page
CartPage (src/pages/CartPage.ts)
verifyItemsInCart(expectedItems: string[]) – Ensures the cart contents match the selected items
proceedToCheckout() – Navigates to the first checkout step
CheckoutPage (src/pages/CheckoutPage.ts)
fillCustomerInfo(firstName, lastName, zipCode) – Fills the checkout form and validates navigation to step two, reporting any validation errors
completeOrder() – Finishes the order and navigates to the completion page
OrderCompletePage (src/pages/OrderCompletePage.ts)
verifyOrderComplete() – Verifies the “Thank you for your order!” confirmation
🔁 Main Checkout Scenario
The main end-to-end test is implemented in tests/e2e/checkout.spec.ts and follows this flow:

Navigate to the Swag Labs site.
Log in with the selected persona (default: standard_user).
Add the first two inventory items to the cart.
Verify the items in the cart.
Proceed through checkout step one.
Fill in customer details and continue to step two.
Complete the order.
Verify the order confirmation page.
The test is also aware of which persona is being used and logs this to the console for easier debugging.

🧩 Utility Helpers
Located in src/utils/:

RandomHelper
Generates random numbers and ZIP codes
Picks random elements from arrays
DateHelper
Basic date formatting and date arithmetic helpers
StringHelper
Generates random strings and emails
Basic text utilities
These helpers are intended to avoid duplication and support future scenarios (such as additional flows or data-driven tests) without changing the core framework.

🔍 Design Considerations
Separation of Concerns
Page actions and locators are isolated in Page Objects.
Test logic is focused on business flow and assertions.
Data and personas are centralized in the data layer.
Stability and Flakiness Reduction
Fixed data by default in CI.
Retries and traces enabled in CI only.
Stable selectors using data-test attributes.
Scalability
Structure supports adding more flows (sorting, filtering, negative tests) with minimal changes.
Tags allow selective execution (smoke vs regression vs persona-focused runs).
Team Adoption and CI Integration
NPM scripts make it easy to run common test sets.
JSON report output can be integrated into dashboards or pipelines.
Environment variables allow configuration without changing code.
---

## 🧪 Experimental: Agentic Automation Prototype

In addition to this stable POM framework, I have included an **experimental branch** (`experimental/agentic-automation`) that explores the future of "No-Code" testing using GPT-4 Vision.

### The Vision:
- **Self-Healing**: AI adapts to UI changes automatically, reducing maintenance debt.
- **Natural Language**: Tests are defined in plain English via YAML instructions.
- **Visual Reasoning**: The agent "sees" the page to identify elements and verify outcomes.

### How to Explore:
1. Switch to the experimental branch: `git checkout experimental/agentic-automation`
2. View the prototype documentation in `tests/experimental/README.md`.
3. Review the YAML-driven test engine in `tests/experimental/agentic-checkout.spec.ts`.

*Note: This is an architectural proof-of-concept and is configured to skip gracefully in CI if no API key is present, ensuring zero impact on the stability of the core regression suite.*