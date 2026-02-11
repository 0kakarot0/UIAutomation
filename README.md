# UI Automation Framework - Automation Exercise

This project is a clean, production-ready UI automation framework using **Playwright** with **TypeScript**, designed to test the [Automation Exercise](https://www.automationexercise.com/) website. It follows the **Page Object Model (POM)** design pattern for maintainability and scalability.

## 🚀 Features

- **Playwright & TypeScript**: Fast, reliable, and strongly typed.
- **Page Object Model (POM)**: separation of page elements and test logic.
- **E2E Flow**: Covers User Registration, Product Search, Add to Cart, Checkout, and Payment.
- **Dynamic Data**: Generates random user data for every run to ensure isolation.
- **Reporting**: HTML and List reporters configured.
- **CI/CD Ready**: specific configuration for CI environments (retries, headless).

## 🛠️ Prerequisites

- **Node.js**: v14 or higher (Recommended: LTS)
- **npm** (comes with Node.js)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright Browsers:**
   ```bash
   npx playwright install
   ```

## 🏃 Running Tests

### Run all tests
```bash
npx playwright test
```

### Run a specific test file
```bash
npx playwright test tests/e2e.spec.ts
```

### Run in UI Mode (Interactive)
```bash
npx playwright test --ui
```

### Run in Headed Mode (Visible Browser)
```bash
npx playwright test --headed
```

### View Report
```bash
npx playwright show-report
```

## 📂 Project Structure

```
├── config/             # Environment configuration (URLs, Timeouts)
├── pages/              # Page Object Classes (Locators & Methods)
├── tests/              # Test Specifications (e2e.spec.ts)
├── utils/              # Helper functions (Random data generators)
├── playwright.config.ts # Main Playwright configuration
├── package.json        # Dependencies and Scripts
└── README.md           # Documentation
```

## ⚙️ Configuration

- **Base URL**: Configured in `config/envConfig.ts` (Default: `https://www.automationexercise.com`).
- **Timeouts**: Global and action timeouts are centrally managed in `config/envConfig.ts`.
- **Environment Variables**: Supports `.env` file for secrets (if extended).

## 📝 Test Flow w/ Verification

The main E2E test (`tests/e2e.spec.ts`) performs the following:
1. **Product Search**: Searches for "Blue Top".
2. **Registration**: Registers a unique user (Randomized).
3. **Cart**: Adds product to cart and verifies contents.
4. **Checkout**: Proceeds to checkout, verifies address.
5. **Payment**: Simulates entering card details and confirming order.
6. **Cleanup**: Deletes the created account.

---
**Author**: Antigravity SDET
