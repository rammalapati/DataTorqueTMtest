#DataTorque TestManager Tech Assessment ** Test Automation Framework for SauceDemo automating the flow of cart checkout adding first two products to the cart**

A robust, scalable end-to-end testing framework for [Sauce Demo](https://www.saucedemo.com/) built with **Playwright** and **TypeScript**.

## Architecture: Page Object Model (POM)
This project implements the Page Object Model design pattern to separate test logic from page-specific locators and actions. This ensures the suite is:
- **Maintainable**: Changes to the UI only require updates in one Page Class.
- **Readable**: Test scripts follow a clear, descriptive flow.
- **Reusable**: Common actions (like login or adding items) are shared across tests.

##  Tech Stack
- **Language**: TypeScript
- **Test Runner**: Playwright
- **Design Pattern**: Page Object Model (POM)
- **Reporting**: Playwright HTML Reporter

##  Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository:
   ```bash git clone https://github.com/rammalapati/DataTorqueTMtest.git
2. Install Dependencies
   npm install
   
3.Install Chromium Browser
   npm npx playwright install chromium
   
- **Executing Tests**:
  Headless Execution
- npx playwright test
  UI Execution
- npx playwright test --headed
- **Executing with different User Profiles**
- Standard User: npx playwright test
- Problem User: SWAG_USERNAME=problem_user npx playwright test --headed
- Performance Glitch User: SWAG_USERNAME=performance_glitch_user npx playwright test --headed
- Lockedout User: SWAG_USERNAME=locked_out_user npx playwright test --headed

  
***Reporting***
Detailed HTML reports, including traces and screenshots on failure, are automatically generated. To view the latest report:
npx playwright show-report
