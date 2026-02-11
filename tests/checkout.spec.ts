import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { AccountCreationPage } from '../pages/AccountCreationPage';
import { PaymentPage } from '../pages/PaymentPage';
import { generateRandomEmail, generateRandomName } from '../utils/helpers';

test.describe('Checkout Tests', () => {
    let homePage: HomePage;
    let productsPage: ProductsPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;
    let loginPage: LoginPage;
    let accountCreationPage: AccountCreationPage;
    let paymentPage: PaymentPage;

    const name = generateRandomName();
    const email = generateRandomEmail();
    const password = 'Pass123';

    test.beforeEach(async ({page, context}) => {
        // 🚫 Block Google Ads (must be before navigation)
        await context.route('**/*googlesyndication.com/**', route => route.abort());
        await context.route('**/*doubleclick.net/**', route => route.abort());        homePage = new HomePage(page);
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        loginPage = new LoginPage(page);
        accountCreationPage = new AccountCreationPage(page);
        paymentPage = new PaymentPage(page);
        await homePage.navigateTo();
    });

    // Test Case 14: Place Order: Register while Checkout
    test('TC 14: Place Order: Register while Checkout', async ({ page }) => {
        await homePage.clickProducts();
        await productsPage.addProductToCart('Blue Top');
        await productsPage.proceedToCart();

        await cartPage.proceedToCheckout();
        // Should prompt register/login
        await expect(page.getByRole('link', { name: 'Register / Login' })).toBeVisible();
        await page.getByRole('link', { name: 'Register / Login' }).click();

        // Register
        await loginPage.signup(name, email);
        await accountCreationPage.fillAccountDetails(password, 'First', 'Last', 'Address', 'State', 'City', '10001', '1234567890');
        await accountCreationPage.createAccount();
        await accountCreationPage.clickContinue();
        await expect(page.getByText(`Logged in as ${name}`)).toBeVisible();

        await homePage.clickCart();
        await cartPage.proceedToCheckout();

        await checkoutPage.placeOrder('Test Order TC14');
        await paymentPage.fillPaymentDetails('Test Name', '1234567812345678', '123', '01', '2030');
        await paymentPage.confirmPayment();
        await expect(page.getByText('Order Placed!')).toBeVisible();

        await homePage.clickDeleteAccount();
    });

    // Test Case 15: Place Order: Register before Checkout
    test('TC 15: Place Order: Register before Checkout', async ({ page }) => {
        // Register First
        await homePage.clickSignupLogin();
        const tEmail = generateRandomEmail();
        const tName = generateRandomName();
        await loginPage.signup(tName, tEmail);
        await accountCreationPage.fillAccountDetails(password, 'First', 'Last', 'Address', 'State', 'City', '10001', '1234567890');
        await accountCreationPage.createAccount();
        await accountCreationPage.clickContinue();

        // Shop
        await homePage.clickProducts();
        await productsPage.addProductToCart('Blue Top');
        await productsPage.proceedToCart();
        await cartPage.proceedToCheckout();

        await checkoutPage.placeOrder('Test Order TC15');
        await paymentPage.fillPaymentDetails('Test Name', '1234567812345678', '123', '01', '2030');
        await paymentPage.confirmPayment();
        await expect(page.getByText('Order Placed!')).toBeVisible();

        await homePage.clickDeleteAccount();
    });

    // Test Case 16: Place Order: Login before Checkout
    test('TC 16: Place Order: Login before Checkout', async ({ page }) => {
        // Prerequisite: Create user
        const tEmail = generateRandomEmail();
        const tName = generateRandomName();

        await homePage.clickSignupLogin();
        await loginPage.signup(tName, tEmail);
        await accountCreationPage.fillAccountDetails(password, 'First', 'Last', 'Address', 'State', 'City', '10001', '1234567890');
        await accountCreationPage.createAccount();
        await accountCreationPage.clickContinue();
        await homePage.clickLogout();

        // Actual Test
        await homePage.clickSignupLogin();
        await loginPage.login(tEmail, password);
        await expect(page.getByText(`Logged in as ${tName}`)).toBeVisible();

        await homePage.clickProducts();
        await productsPage.addProductToCart('Blue Top');
        await productsPage.proceedToCart();
        await cartPage.proceedToCheckout();

        await checkoutPage.placeOrder('Test Order TC16');
        await paymentPage.fillPaymentDetails('Test Name', '1234567812345678', '123', '01', '2030');
        await paymentPage.confirmPayment();
        await expect(page.getByText('Order Placed!')).toBeVisible();

        await homePage.clickDeleteAccount();
    });

    // Test Case 23: Verify address details in checkout page
    test('TC 23: Verify address details in checkout page', async ({ page }) => {
        // Register
        await homePage.clickSignupLogin();
        const tEmail = generateRandomEmail();
        const tName = generateRandomName();
        await loginPage.signup(tName, tEmail);
        // Using specific address to verify
        const address = '123 Test Street';
        await accountCreationPage.fillAccountDetails(password, 'First', 'Last', address, 'State', 'City', '10001', '1234567890');
        await accountCreationPage.createAccount();
        await accountCreationPage.clickContinue();

        await homePage.clickProducts();
        await productsPage.addProductToCart('Blue Top');
        await productsPage.proceedToCart();
        await cartPage.proceedToCheckout();

        await checkoutPage.verifyAddressDetails('First', 'Last', address);

        await homePage.clickDeleteAccount();
    });

    // Test Case 24: Download Invoice after purchase order
    test('TC 24: Download Invoice after purchase order', async ({ page }) => {
        await homePage.clickSignupLogin();
        const tEmail = generateRandomEmail();
        const tName = generateRandomName();
        await loginPage.signup(tName, tEmail);
        await accountCreationPage.fillAccountDetails(password, 'First', 'Last', 'Address', 'State', 'City', '10001', '1234567890');
        await accountCreationPage.createAccount();
        await accountCreationPage.clickContinue();

        await homePage.clickProducts();
        await productsPage.addProductToCart('Blue Top');
        await productsPage.proceedToCart();
        await cartPage.proceedToCheckout();

        await checkoutPage.placeOrder('Invoice Test');
        await paymentPage.fillPaymentDetails('Test Name', '1234567812345678', '123', '01', '2030');
        await paymentPage.confirmPayment();

        // Verify Invoice Download
        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('link', { name: 'Download Invoice' }).click();
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toContain('invoice');

        await homePage.clickDeleteAccount();
    });
});
