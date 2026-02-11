# UI Automation Framework - Automation Exercise

A production-ready UI automation framework using **Playwright** with **TypeScript**, following the **Page Object Model (POM)** design pattern. It tests the [Automation Exercise](https://www.automationexercise.com/) e-commerce site.

---

## Features

- **Playwright & TypeScript** — Fast, reliable, strongly typed tests
- **Page Object Model (POM)** — Clear separation of page structure and test logic
- **Multiple test suites** — Authentication, Products, Cart, Checkout, E2E flow, and miscellaneous
- **Dynamic test data** — Random user data per run for test isolation
- **Reporting** — Playwright HTML + **Allure** results (with attachments)
- **CI-ready** — Retries and headless configuration for CI (e.g. GitHub Actions)

---

## Prerequisites

- **Node.js** — v14 or higher (LTS recommended)
- **npm** — Included with Node.js

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/0kakarot0/UIAutomation.git
   cd UIAutomation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers** (first-time setup)
   ```bash
   npx playwright install
   ```

---

## How to Run Tests

### Run all tests (default: headless, Chromium)
```bash
npm test
```
or
```bash
npx playwright test
```

### Run with visible browser (headed)
```bash
npm run test:headed
```
or
```bash
npx playwright test --headed
```

### Run in UI mode (interactive)
```bash
npm run test:ui
```
or
```bash
npx playwright test --ui
```

### Debug mode (step-through, inspector)
```bash
npm run test:debug
```
or
```bash
npx playwright test --debug
```

### Re-run only failed tests
```bash
npm run test:failed
```
or
```bash
npx playwright test --last-failed
```

### Run a specific test file
```bash
npx playwright test tests/auth.spec.ts
npx playwright test tests/cart.spec.ts
npx playwright test tests/checkout.spec.ts
npx playwright test tests/e2e.spec.ts
npx playwright test tests/misc.spec.ts
npx playwright test tests/products.spec.ts
```

### Run a specific test by name
```bash
npx playwright test -g "Register User"
```

### View the last HTML report
```bash
npx playwright show-report
```

### Allure report (summary)

- **Generate & open Allure report in one step:**

  ```bash
  npm run test:allure
  ```

- **Or manually:**

  ```bash
  # 1. Run tests (produces allure-results/)
  npm test

  # 2. Generate static Allure report into allure-report/
  npm run report:gen

  # 3. Open the generated report in a browser
  npm run report:open
  ```

For more details on how reporting is wired (reporters, folders, CI tips), see `docs/REPORTING.md`.

---

## Test Types Included in This Project

Tests are aligned with [Automation Exercise](https://www.automationexercise.com/) test cases and grouped by feature.

| Suite | File | Description |
|-------|------|-------------|
| **Authentication** | `tests/auth.spec.ts` | Signup, login, logout, duplicate email |
| **Products** | `tests/products.spec.ts` | Product list, search, categories, brands, reviews |
| **Cart** | `tests/cart.spec.ts` | Add to cart, quantity, remove items |
| **Checkout** | `tests/checkout.spec.ts` | Place order flows, address, invoice download |
| **E2E** | `tests/e2e.spec.ts` | Full flow: search → register → cart → checkout → payment |
| **Miscellaneous** | `tests/misc.spec.ts` | Contact form, test cases page, subscription, scroll |

### Authentication (`auth.spec.ts`)

- **TC 1** — Register User: signup, complete account, verify, delete account  
- **TC 2** — Login with correct email and password  
- **TC 3** — Login with incorrect email/password (error message)  
- **TC 4** — Logout User  
- **TC 5** — Register with existing email (validation)

### Products (`products.spec.ts`)

- **TC 8** — Verify All Products and product detail page  
- **TC 9** — Search Product  
- **TC 18** — View category products (e.g. Women/Dress, Men/Tshirts)  
- **TC 19** — View and filter by brand (Polo, H&M)  
- **TC 20** — Search products and verify cart (with login)  
- **TC 21** — Add review on product  
- **TC 22** — Add to cart from Recommended items  

### Cart (`cart.spec.ts`)

- **TC 12** — Add multiple products in cart  
- **TC 13** — Verify product quantity in cart  
- **TC 17** — Remove products from cart  

### Checkout (`checkout.spec.ts`)

- **TC 14** — Place order: register during checkout  
- **TC 15** — Place order: register before checkout  
- **TC 16** — Place order: login before checkout  
- **TC 23** — Verify address details on checkout page  
- **TC 24** — Download invoice after purchase  

### E2E (`e2e.spec.ts`)

- Full shopping flow: product search → user registration → add to cart → checkout → payment → account cleanup  

### Miscellaneous (`misc.spec.ts`)

- **TC 6** — Contact Us form  
- **TC 7** — Verify Test Cases page  
- **TC 10** — Subscription on home page  
- **TC 11** — Subscription on cart page  
- **TC 25** — Scroll up/down (arrow button)  

---

## Project Structure

```
├── config/                 # Environment & app config
│   ├── constants.ts        # Base URL, timeouts (env overrides)
│   └── envConfig.ts        # Test user defaults, env config
├── pages/                  # Page Object classes
│   ├── BasePage.ts
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── AccountCreationPage.ts
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── PaymentPage.ts
│   ├── ContactUsPage.ts
│   └── TestCasesPage.ts
├── tests/                  # Test specs
│   ├── auth.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   ├── e2e.spec.ts
│   ├── misc.spec.ts
│   └── products.spec.ts
├── types/                  # Shared TypeScript types
│   └── index.ts
├── utils/                  # Helpers & utilities
│   ├── helpers.ts          # Random data (email, name)
│   ├── PlaywrightUtils.ts
│   └── WaitUtils.ts
├── playwright.config.ts    # Playwright config (reporters, timeouts, projects)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Configuration

- **Base URL** — `config/envConfig.ts` (default: `https://www.automationexercise.com`)  
- **Timeouts** — Global and action timeouts in `config/constants.ts` / `config/envConfig.ts`  
- **Environment** — Optional `.env` for `BASE_URL`, `TEST_EMAIL`, `TEST_PASSWORD`, `GLOBAL_TIMEOUT`, etc. (do not commit `.env`; use `.env.example` as a template if needed.)

---

## Ignored by Git

The repo ignores: `node_modules/`, `test-results/`, `playwright-report/`, `blob-report/`, `.env`, `.DS_Store`, and common IDE/OS files so that builds and reports stay local and secrets are not committed.

---

**Author**: Ahtisham
